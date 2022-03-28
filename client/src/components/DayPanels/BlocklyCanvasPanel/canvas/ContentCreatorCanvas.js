import React, { useEffect, useRef, useState, useReducer } from 'react';
import '../../DayPanels.less';
import {
  compileArduinoCode,
  handleCreatorSaveActivity,
  handleCreatorSaveDay,
  handleUpdateWorkspace,
} from '../../Utils/helpers';
import { message, Spin, Row, Col, Alert, Dropdown, Menu } from 'antd';
import CodeModal from '../modals/CodeModal';
import SaveAsModal from '../modals/SaveAsModal';
import ConsoleModal from '../modals/ConsoleModal';
import PlotterModal from '../modals/PlotterModal';
import StudentToolboxMenu from '../modals/StudentToolboxMenu';
import LoadWorkspaceModal from '../modals/LoadWorkspaceModal';
import {
  connectToPort,
  handleCloseConnection,
  handleOpenConnection,
} from '../../Utils/consoleHelpers';
import {
  getCCWorkspace,
  getCCWorkspaceToolbox,
} from '../../../../Utils/requests';
import ArduinoLogo from '../Icons/ArduinoLogo';
import PlotterLogo from '../Icons/PlotterLogo';
import { useNavigate } from 'react-router-dom';

let plotId = 1;

export default function ContentCreatorCanvas({
  day,
  isSandbox,
  setDay,
  isMentorActivity,
}) {
  const [hoverXml, setHoverXml] = useState(false);
  const [hoverLoadWorkspace, setHoverLoadWorkspace] = useState(false);
  const [hoverSave, setHoverSave] = useState(false);
  const [hoverSaveAs, setHoverSaveAs] = useState(false);
  const [hoverUndo, setHoverUndo] = useState(false);
  const [hoverRedo, setHoverRedo] = useState(false);
  const [hoverArduino, setHoverArduino] = useState(false);
  const [hoverCompile, setHoverCompile] = useState(false);
  const [hoverConsole, setHoverConsole] = useState(false);
  const [hoverPlotter, setHoverPlotter] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [showPlotter, setShowPlotter] = useState(false);
  const [showSaveAsModal, setShowSaveAsModal] = useState(false);
  const [plotData, setPlotData] = useState([]);
  const [connectionOpen, setConnectionOpen] = useState(false);
  const [selectedCompile, setSelectedCompile] = useState(false);
  const [compileError, setCompileError] = useState('');
  const [studentToolbox, setStudentToolbox] = useState([]);
  const [openedToolBoxCategories, setOpenedToolBoxCategories] = useState([]);

  const navigate = useNavigate();
  const [forceUpdate] = useReducer((x) => x + 1, 0);
  const workspaceRef = useRef(null);
  const dayRef = useRef(null);

  const setWorkspace = () => {
    workspaceRef.current = window.Blockly.inject('blockly-canvas', {
      toolbox: document.getElementById('toolbox'),
    });
  };

  const loadSave = async (workspaceId) => {
    // get the corresponding workspace
    const res = await getCCWorkspace(workspaceId);
    if (res.data) {
      // set up the canvas
      if (workspaceRef.current) workspaceRef.current.clear();
      let xml = window.Blockly.Xml.textToDom(res.data.template);
      window.Blockly.Xml.domToWorkspace(xml, workspaceRef.current);

      // if we are not in sandbox mode, only the canvas will be changed.
      // set the toolbox here
      if (!isSandbox) {
        const toolboxRes = await getCCWorkspaceToolbox(workspaceId);
        if (toolboxRes.data) {
          let tempCategories = [],
            tempToolBox = [];
          toolboxRes.data.toolbox &&
            toolboxRes.data.toolbox.forEach(([category, blocks]) => {
              tempCategories.push(category);
              tempToolBox = [
                ...tempToolBox,
                ...blocks.map((block) => block.name),
              ];
            });

          setOpenedToolBoxCategories(tempCategories);
          setStudentToolbox(tempToolBox);
        }
      }

      // else if we are in sandbox, we will change the current workspace to the loaded worksapce
      else {
        // set up the student toolbox
        const toolboxRes = await getCCWorkspaceToolbox(res.data.id);
        if (toolboxRes.data) {
          //update localstorage
          let localDay = {
            ...res.data,
            selectedToolbox: toolboxRes.data.toolbox,
            toolbox: day.toolbox,
          };
          setDay(localDay);
        }
      }
      return true;
    } else {
      message.error(res.err);
      return false;
    }
  };

  const handleGoBack = () => {
    if (
      window.confirm(
        'All unsaved progress will be lost. Do you still want to go back?'
      )
    )
      navigate(-1);
  };

  useEffect(() => {
    // once the day state is set, set the workspace and save
    const setUp = async () => {
      dayRef.current = day;
      if (!workspaceRef.current && day && Object.keys(day).length !== 0) {
        setWorkspace();

        let xml = isMentorActivity
          ? window.Blockly.Xml.textToDom(day.activity_template)
          : window.Blockly.Xml.textToDom(day.template);
        window.Blockly.Xml.domToWorkspace(xml, workspaceRef.current);
        workspaceRef.current.clearUndo();
      }
    };
    setUp();
  }, [day, isSandbox]);

  const handleCreatorSave = async () => {
    // Save day template
    if (!isSandbox && !isMentorActivity) {
      const res = await handleCreatorSaveDay(
        day.id,
        workspaceRef,
        studentToolbox
      );
      if (res.err) {
        message.error(res.err);
      } else {
        message.success('Day Template saved successfully');
      }
    } else if (!isSandbox && isMentorActivity) {
      // Save activity template
      const res = await handleCreatorSaveActivity(day.id, workspaceRef);
      if (res.err) {
        message.error(res.err);
      } else {
        message.success('Activity template saved successfully');
      }
    } else {
      // if we already have the workspace in the db, just update it.
      if (day && day.id) {
        const updateRes = await handleUpdateWorkspace(
          day.id,
          workspaceRef,
          studentToolbox
        );
        if (updateRes.err) {
          message.error(updateRes.err);
        } else {
          message.success('Workspace saved successfully');
        }
      }
      // else create a new workspace and update local storage
      else {
        setShowSaveAsModal(true);
      }
    }
  };

  const handleUndo = () => {
    if (workspaceRef.current.undoStack_.length > 0)
      workspaceRef.current.undo(false);
  };

  const handleRedo = () => {
    if (workspaceRef.current.redoStack_.length > 0)
      workspaceRef.current.undo(true);
  };

  const handleConsole = async () => {
    if (showPlotter) {
      message.warning('Close serial plotter before openning serial monitor');
      return;
    }
    // if serial monitor is not shown
    if (!showConsole) {
      // connect to port
      await handleOpenConnection(9600, 'newLine');
      // if fail to connect to port, return
      if (typeof window['port'] === 'undefined') {
        message.error('Fail to select serial device');
        return;
      }
      setConnectionOpen(true);
      setShowConsole(true);
    }
    // if serial monitor is shown, close the connection
    else {
      if (connectionOpen) {
        await handleCloseConnection();
        setConnectionOpen(false);
      }
      setShowConsole(false);
    }
  };

  const handlePlotter = async () => {
    if (showConsole) {
      message.warning('Close serial monitor before openning serial plotter');
      return;
    }

    if (!showPlotter) {
      await handleOpenConnection(
        9600,
        'plot',
        plotData,
        setPlotData,
        plotId,
        forceUpdate
      );
      if (typeof window['port'] === 'undefined') {
        message.error('Fail to select serial device');
        return;
      }
      setConnectionOpen(true);
      setShowPlotter(true);
    } else {
      plotId = 1;
      if (connectionOpen) {
        await handleCloseConnection();
        setConnectionOpen(false);
      }
      setShowPlotter(false);
    }
  };

  const handleCompile = async () => {
    if (showConsole || showPlotter) {
      message.warning(
        'Close Serial Monitor and Serial Plotter before uploading your code'
      );
    } else {
      if (typeof window['port'] === 'undefined') {
        await connectToPort();
      }
      if (typeof window['port'] === 'undefined') {
        message.error('Fail to select serial device');
        return;
      }
      setCompileError('');
      await compileArduinoCode(
        workspaceRef.current,
        setSelectedCompile,
        setCompileError,
        day,
        false
      );
    }
  };


  const menu = (
    <Menu>
      <Menu.Item id='menu-save'
        onClick={handleCreatorSave}
        >
          <i className='fa fa-save' />
          &nbsp; Save
      </Menu.Item>
      <SaveAsModal 
        hover={hoverSaveAs}
        setHover={setHoverSaveAs}
        visible={showSaveAsModal}
        setVisible={setShowSaveAsModal}
        workspaceRef={workspaceRef}
        studentToolbox={studentToolbox}
        day={day}
        setDay={setDay}
        isSandbox={isSandbox}
      />
        <LoadWorkspaceModal
        hover={hoverLoadWorkspace}
        setHover={setHoverLoadWorkspace}
        loadSave={loadSave}
      />
    </Menu>
  );

  const menuShow = (
    <Menu>
      <Menu.Item onClick={handlePlotter}>
        <PlotterLogo/>        
        &nbsp; Show Serial Plotter
      </Menu.Item>
        <CodeModal
          title={'XML'}
          workspaceRef={workspaceRef.current}
          setHover={setHoverXml}
          hover={hoverXml}
        />
      <Menu.Item>
        <CodeModal
          title={'Arduino Code'}
          workspaceRef={workspaceRef.current}
          setHover={setHoverArduino}
          hover={hoverArduino}
        />
      </Menu.Item>
    </Menu>
  );

  return (
    <div id='horizontal-container' className='flex flex-column'>
      <div className='flex flex-row'>
        <div
          id='bottom-container'
          className='flex flex-column vertical-container overflow-visible'
        >
          <Spin
            tip='Compiling Code Please Wait... It may take up to 20 seconds to compile your code.'
            className='compilePop'
            size='large'
            spinning={selectedCompile}
          >
            <Row id='icon-control-panel'>
              <Col flex='none' id='section-header'>
                {day.learning_standard_name
                  ? `${day.learning_standard_name} - Day ${day.number} - ${
                      isMentorActivity ? 'Activity' : 'Day'
                    } Template`
                  : day.name
                  ? `Workspace: ${day.name}`
                  : 'New Workspace!'}
              </Col>
              <Col flex='auto'>
                <Row align='middle' justify='end' id='description-container'>
                  <Col flex={'30px'}>
                    <button
                      onClick={handleGoBack}
                      id='link'
                      className='flex flex-column'
                    >
                      <i id='icon-btn' className='fa fa-arrow-left' />
                    </button>
                  </Col>
                  <Col flex='auto' />
                  <Row>
                    <Col className='flex flex-row'>
                    <Col className='flex flex-row' id='save-dropdown-container'>
                      <Dropdown overlay={menu}>
                        <i id='save-dropdown-icon' className='fa fa-save' /> 
                      </Dropdown>
                      <i className='fas fa-angle-down' id='caret'></i>
                    </Col>
                    </Col>
                    <Col className='flex flex-row' id='redo-undo-container'>
                      <button
                        onClick={handleUndo}
                        id='link'
                        className='flex flex-column'
                      >
                        <i
                          id='icon-btn'
                          className='fa fa-undo-alt'
                          style={
                            workspaceRef.current
                              ? workspaceRef.current.undoStack_.length < 1
                                ? { color: 'grey', cursor: 'default' }
                                : null
                              : null
                          }
                          onMouseEnter={() => setHoverUndo(true)}
                          onMouseLeave={() => setHoverUndo(false)}
                        />
                        {hoverUndo && (
                          <div className='popup ModalCompile4'>Undo</div>
                        )}
                      </button>
                      <button
                        onClick={handleRedo}
                        id='link'
                        className='flex flex-column'
                      >
                        <i
                          id='icon-btn'
                          className='fa fa-redo-alt'
                          style={
                            workspaceRef.current
                              ? workspaceRef.current.redoStack_.length < 1
                                ? { color: 'grey', cursor: 'default' }
                                : null
                              : null
                          }
                          onMouseEnter={() => setHoverRedo(true)}
                          onMouseLeave={() => setHoverRedo(false)}
                        />
                        {hoverRedo && (
                          <div className='popup ModalCompile4'>Redo</div>
                        )}
                      </button>
                    </Col>
                    <Col className='flex flex-row'>
                      <div
                        id='action-btn-container'
                        className='flex space-around'
                      >
                        <ArduinoLogo
                          setHoverCompile={setHoverCompile}
                          handleCompile={handleCompile}
                        />
                        {hoverCompile && (
                          <div className='popup ModalCompile'>
                            Upload to Arduino
                          </div>
                        )}

                        <i
                          onClick={() => handleConsole()}
                          className='fas fa-terminal hvr-info'
                          style={{ marginLeft: '6px' }}
                          onMouseEnter={() => setHoverConsole(true)}
                          onMouseLeave={() => setHoverConsole(false)}
                        />
                        {hoverConsole && (
                          <div className='popup ModalCompile'>
                            Show Serial Monitor
                          </div>
                        )}
                        <Dropdown overlay={menuShow}>
                            <i className='fas fa-ellipsis-v'></i>
                        </Dropdown>
                      </div>
                    </Col>
                  </Row>
                </Row>
              </Col>
            </Row>
            <div id='blockly-canvas' />
          </Spin>
        </div>
        {!isMentorActivity && (
          <StudentToolboxMenu
            day={day}
            studentToolbox={studentToolbox}
            setStudentToolbox={setStudentToolbox}
            openedToolBoxCategories={openedToolBoxCategories}
            setOpenedToolBoxCategories={setOpenedToolBoxCategories}
          />
        )}
        <ConsoleModal
          show={showConsole}
          connectionOpen={connectionOpen}
          setConnectionOpen={setConnectionOpen}
        ></ConsoleModal>
        <PlotterModal
          show={showPlotter}
          connectionOpen={connectionOpen}
          setConnectionOpen={setConnectionOpen}
          plotData={plotData}
          setPlotData={setPlotData}
          plotId={plotId}
        />
      </div>

      {/* This xml is for the blocks' menu we will provide. Here are examples on how to include categories and subcategories */}
      <xml id='toolbox' is='Blockly workspace'>
        {
          // Maps out block categories
          day &&
            day.toolbox &&
            day.toolbox.map(([category, blocks]) => (
              <category name={category} is='Blockly category' key={category}>
                {
                  // maps out blocks in category
                  // eslint-disable-next-line
                  blocks.map((block) => {
                    return (
                      <block
                        type={block.name}
                        is='Blockly block'
                        key={block.name}
                      />
                    );
                  })
                }
              </category>
            ))
        }
      </xml>

      {compileError && (
        <Alert
          message={compileError}
          type='error'
          closable
          onClose={(e) => setCompileError('')}
        ></Alert>
      )}
    </div>
  );
}
