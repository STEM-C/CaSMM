import React, { useEffect, useRef, useState, useReducer } from 'react';
import '../../DayPanels.less';
import { compileArduinoCode, handleSave } from '../../Utils/helpers';
import { message, Spin, Row, Col, Alert } from 'antd';
import { getSaves } from '../../../../Utils/requests';
import CodeModal from '../modals/CodeModal';
import ConsoleModal from '../modals/ConsoleModal';
import PlotterModal from '../modals/PlotterModal';
import VersionHistoryModal from '../modals/VersionHistoryModal';
import {
  connectToPort,
  handleCloseConnection,
  handleOpenConnection,
} from '../../Utils/consoleHelpers';
import ArduinoLogo from '../Icons/ArduinoLogo';
import PlotterLogo from '../Icons/PlotterLogo';
import { useNavigate } from 'react-router-dom';

let plotId = 1;

export default function StudentCanvas({ day }) {
  const [hoverSave, setHoverSave] = useState(false);
  const [hoverUndo, setHoverUndo] = useState(false);
  const [hoverRedo, setHoverRedo] = useState(false);
  const [hoverArduino, setHoverArduino] = useState(false);
  const [hoverCompile, setHoverCompile] = useState(false);
  const [hoverConsole, setHoverConsole] = useState(false);
  const [hoverPlotter, setHoverPlotter] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [showPlotter, setShowPlotter] = useState(false);
  const [plotData, setPlotData] = useState([]);
  const [connectionOpen, setConnectionOpen] = useState(false);
  const [selectedCompile, setSelectedCompile] = useState(false);
  const [compileError, setCompileError] = useState('');
  const [saves, setSaves] = useState({});
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [lastAutoSave, setLastAutoSave] = useState(null);

  const [clicks, setClicks] = useState(0);
  const parser = new DOMParser();

  const [forceUpdate] = useReducer((x) => x + 1, 0);
  const navigate = useNavigate();
  const workspaceRef = useRef(null);
  const dayRef = useRef(null);
  const replayRef = useRef([]);
  const undoLength = useRef(0);

  const setWorkspace = () => {
    workspaceRef.current = window.Blockly.inject('blockly-canvas', {
      toolbox: document.getElementById('toolbox'),
    });
  };

  const loadSave = (selectedSave) => {
    try {
      let toLoad = day.template;
      if (selectedSave !== -1) {
        if (lastAutoSave && selectedSave === -2) {
          toLoad = lastAutoSave.workspace;
          setLastSavedTime(getFormattedDate(lastAutoSave.updated_at));
        } else if (saves.current && saves.current.id === selectedSave) {
          toLoad = saves.current.workspace;
          setLastSavedTime(getFormattedDate(saves.current.updated_at));
        } else {
          const s = saves.past.find((save) => save.id === selectedSave);
          if (s) {
            toLoad = s.workspace;
            setLastSavedTime(getFormattedDate(s.updated_at));
          } else {
            message.error('Failed to restore save.');
            return;
          }
        }
      } else {
        setLastSavedTime(null);
      }
      let xml = window.Blockly.Xml.textToDom(toLoad);
      if (workspaceRef.current) workspaceRef.current.clear();
      window.Blockly.Xml.domToWorkspace(xml, workspaceRef.current);
      workspaceRef.current.clearUndo();
    } catch (e) {
      message.error('Failed to load save.');
    }
  };

  const parseXML = (xml) => {
    const xmlData = {
      blocks: {},
      categories: {},
    };
    let xmlDoc = parser.parseFromString(xml, 'text/xml');
    console.log(xmlDoc);
    const xmlBlocks = xmlDoc.querySelectorAll('block');
    for (const block of xmlBlocks) {
      const blockType = block.getAttribute('type');
      if (xmlData.blocks[blockType]) {
        xmlData.blocks[blockType].count++;
      } else {
        xmlData.blocks[blockType] = {
          count: 1,
          deleted: 0,
        };
      }
    }
    return xmlData;
  };
  const diffObjects = (currentObj, previousObj) => {
    const currentKeys = Object.keys(currentObj);
    const prevKeys = Object.keys(previousObj);
    // deleted all of one type of block
    if (prevKeys.length > currentKeys.length) {
      for (let key of prevKeys) {
        if (currentKeys.indexOf(key) === -1) {
          console.log('deleted all of one block');
          currentObj[key] = {
            count: 0,
            deleted: previousObj[key].deleted + 1,
          };
        }
      }
    }
    for (let key of currentKeys) {
      if (key in previousObj) {
        if (currentObj[key].count < previousObj[key].count) {
          currentObj[key].deleted = previousObj[key].deleted + 1;
          console.log('a block was deleted');
        }
        if (currentObj[key].deleted < previousObj[key].deleted) {
          console.log('a block was reintroduced');
          currentObj[key] = {
            count: 1,
            deleted: previousObj[key].deleted,
          };
        }
      }
    }

    return currentObj;
  };
  const handleClick = () => {
    setClicks(clicks + 1);
    console.log('Clicks: ', clicks);
  };
  const compareXML = (
    { blocks: currentBlocks },
    { blocks: previousBlocks }
  ) => {
    const blocks = diffObjects(currentBlocks, previousBlocks);
    return {
      blocks,
    };
  };

  useEffect(() => {
    // automatically save workspace every min
    let autosaveInterval = setInterval(async () => {
      if (workspaceRef.current && dayRef.current) {
        const res = await handleSave(
          dayRef.current.id,
          workspaceRef,
          replayRef.current
        );
        if (res.data) {
          setLastAutoSave(res.data[0]);
          setLastSavedTime(getFormattedDate(res.data[0].updated_at));
        }
      }
    }, 60000);
    let replaySaveInterval = setInterval(async () => {
      if (
        workspaceRef.current &&
        workspaceRef.current.undoStack_.length !== undoLength.current
      ) {
        undoLength.current = workspaceRef.current.undoStack_.length;
        let xml = window.Blockly.Xml.workspaceToDom(workspaceRef.current);
        let xml_text = window.Blockly.Xml.domToText(xml);
        const xmlData = parseXML(xml_text);
        let previousData;
        let finalData;
        // XML replay starts empty, check to make sure there's at least 2 there
        if (replayRef.current.length > 1) {
          previousData = replayRef.current[replayRef.current.length - 1];
          finalData = compareXML(xmlData, previousData.xmlData);
        }
        const replay = {
          xml: xml_text,
          timestamp: Date.now(),
          xmlData: finalData || xmlData,
          clicks: clicks,
        };
        replayRef.current.push(replay);
        console.log(replayRef.current);
      }
    }, 1000);
    // clean up - saves workspace and removes blockly div from DOM
    return async () => {
      clearInterval(autosaveInterval);
      clearInterval(replaySaveInterval);
      if (dayRef.current && workspaceRef.current)
        await handleSave(dayRef.current.id, workspaceRef, replayRef.current);
      if (workspaceRef.current) workspaceRef.current.dispose();
      dayRef.current = null;
    };
  }, []);

  useEffect(() => {
    // once the day state is set, set the workspace and save
    const setUp = async () => {
      dayRef.current = day;
      if (!workspaceRef.current && day && Object.keys(day).length !== 0) {
        setWorkspace();

        let onLoadSave = null;
        const res = await getSaves(day.id);
        if (res.data) {
          if (res.data.current) onLoadSave = res.data.current;
          setSaves(res.data);
        } else {
          console.log(res.err);
        }

        if (onLoadSave) {
          let xml = window.Blockly.Xml.textToDom(onLoadSave.workspace);
          window.Blockly.Xml.domToWorkspace(xml, workspaceRef.current);
          replayRef.current = onLoadSave.replay;
          setLastSavedTime(getFormattedDate(onLoadSave.updated_at));
        } else if (day.template) {
          let xml = window.Blockly.Xml.textToDom(day.template);
          window.Blockly.Xml.domToWorkspace(xml, workspaceRef.current);
        }

        workspaceRef.current.clearUndo();
      }
    };
    setUp();
  }, [day]);

  const handleManualSave = async () => {
    // save workspace then update load save options
    const res = await handleSave(day.id, workspaceRef, replayRef.current);
    if (res.err) {
      message.error(res.err);
    } else {
      setLastSavedTime(getFormattedDate(res.data[0].updated_at));
      message.success('Workspace saved successfully.');
    }

    const savesRes = await getSaves(day.id);
    if (savesRes.data) setSaves(savesRes.data);
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
        true
      );
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

  const getFormattedDate = (dt) => {
    const d = new Date(Date.parse(dt));
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    let hrs = d.getHours();
    const ampm = hrs >= 12 ? 'PM' : 'AM';
    hrs = hrs % 12;
    hrs = hrs ? hrs : 12;
    let min = d.getMinutes();
    min = min < 10 ? '0' + min : min;
    let sec = d.getSeconds();
    sec = sec < 10 ? '0' + sec : sec;
    return `${month}/${day}/${year}, ${hrs}:${min}:${sec} ${ampm}`;
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
                {day.learning_standard_name}
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

                  <Col flex={'300px'}>
                    {lastSavedTime ? `Last changes saved ${lastSavedTime}` : ''}
                  </Col>
                  <Col flex={'350px'}>
                    <Row>
                      <Col className='flex flex-row'>
                        <VersionHistoryModal
                          saves={saves}
                          lastAutoSave={lastAutoSave}
                          defaultTemplate={day}
                          getFormattedDate={getFormattedDate}
                          loadSave={loadSave}
                        />
                        <button
                          onClick={handleManualSave}
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
                      </Col>

                      <Col className='flex flex-row'>
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
                    </Row>
                  </Col>
                  <Col flex={'180px'}>
                    <div
                      id='action-btn-container'
                      className='flex space-around'
                    >
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
                  </Col>
                </Row>
              </Col>
            </Row>
            <div id='blockly-canvas' onClick={handleClick} />
          </Spin>
        </div>

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
