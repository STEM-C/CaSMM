import React, { useEffect, useRef, useState, useReducer } from 'react';
import '../../DayPanels.less';
import {
  compileArduinoCode,
  handleCreatorSaveDay,
  handleCreatorUpdateWorkspace,
} from '../../Utils/helpers';
import { message, Spin, Row, Col, Alert } from 'antd';
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
import { useHistory } from 'react-router';

let plotId = 1;

export default function ContentCreatorCanvas({ day, isSandbox }) {
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

  const history = useHistory();
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

      // set up the student toolbox
      const toolboxRes = await getCCWorkspaceToolbox(res.data.id);
      if (toolboxRes.data) {
        let tempCategories = [],
          tempToolBox = [];
        toolboxRes.data.toolbox.forEach(([category, blocks]) => {
          tempCategories.push(category);
          tempToolBox = [...tempToolBox, ...blocks.map((block) => block.name)];
        });
        setOpenedToolBoxCategories(tempCategories);
        setStudentToolbox(tempToolBox);

        //update localstorage
        let localDay = { ...res.data, selectedToolbox: tempToolBox };
        localStorage.setItem('sandbox-day', JSON.stringify(localDay));
      }
    }
  };

  const handleGoBack = () => {
    if (
      window.confirm(
        'All unsaved progress will be lost. Do you still want to go back?'
      )
    )
      history.goBack();
  };

  useEffect(() => {
    // once the day state is set, set the workspace and save
    const setUp = async () => {
      dayRef.current = day;
      if (!workspaceRef.current && day && Object.keys(day).length !== 0) {
        setWorkspace();
        let xml = window.Blockly.Xml.textToDom(day.template);
        window.Blockly.Xml.domToWorkspace(xml, workspaceRef.current);
        workspaceRef.current.clearUndo();
      }
    };
    setUp();
  }, [day, isSandbox]);

  const handleCreatorSave = async () => {
    // Save day
    if (!isSandbox) {
      const res = await handleCreatorSaveDay(
        day.id,
        workspaceRef,
        studentToolbox
      );
      if (res.err) {
        message.error(res.err);
      } else {
        message.success('Day saved successfully');
      }
    } else {
      const sandboxDay = JSON.parse(localStorage.getItem('sandbox-day'));
      // if we already have the workspace in the db, just update it.
      if (sandboxDay && sandboxDay.id) {
        const updateRes = await handleCreatorUpdateWorkspace(
          sandboxDay.id,
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
                  ? `${day.learning_standard_name} - Day ${day.number}`
                  : day.name
                  ? `Workspace ${day.id}: ${day.name}`
                  : 'New Workspace!'}
              </Col>
              <Col flex='auto'>
                <Row align='middle' justify='end' id='description-container'>
                  <Col flex={'30px'}>
                    <Row>
                      <Col>
                        <button
                          onClick={handleGoBack}
                          id='link'
                          className='flex flex-column'
                        >
                          <i id='icon-btn' className='fa fa-arrow-left' />
                        </button>
                      </Col>
                    </Row>
                  </Col>
                  <Col flex='auto' />
                  <Row>
                    <Col className='flex flex-row'>
                      <LoadWorkspaceModal
                        hover={hoverLoadWorkspace}
                        setHover={setHoverLoadWorkspace}
                        loadSave={loadSave}
                      />
                      <button
                        onClick={handleCreatorSave}
                        id='link'
                        className='flex flex-column'
                      >
                        <i
                          id='icon-btn'
                          className='fa fa-save'
                          onMouseEnter={() => setHoverSave(true)}
                          onMouseLeave={() => setHoverSave(false)}
                        />
                        {hoverSave && (
                          <div className='popup ModalCompile4'>Save</div>
                        )}
                      </button>
                      <SaveAsModal
                        hover={hoverSaveAs}
                        setHover={setHoverSaveAs}
                        visible={showSaveAsModal}
                        setVisible={setShowSaveAsModal}
                        workspaceRef={workspaceRef}
                        studentToolbox={studentToolbox}
                      />
                    </Col>
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
                  </Row>
                  <div id='action-btn-container' className='flex space-around'>
                    <CodeModal
                      title={'XML'}
                      workspaceRef={workspaceRef.current}
                      setHover={setHoverXml}
                      hover={hoverXml}
                    />
                    <CodeModal
                      title={'Arduino Code'}
                      workspaceRef={workspaceRef.current}
                      setHover={setHoverArduino}
                      hover={hoverArduino}
                    />

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
                    <PlotterLogo
                      setHoverPlotter={setHoverPlotter}
                      handlePlotter={handlePlotter}
                    />
                    {hoverPlotter && (
                      <div className='popup ModalCompile'>
                        Show Serial Plotter
                      </div>
                    )}
                  </div>
                </Row>
              </Col>
            </Row>
            <div id='blockly-canvas' />
          </Spin>
        </div>
        <StudentToolboxMenu
          day={day}
          studentToolbox={studentToolbox}
          setStudentToolbox={setStudentToolbox}
          openedToolBoxCategories={openedToolBoxCategories}
          setOpenedToolBoxCategories={setOpenedToolBoxCategories}
        />
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
