import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../DayPanels.less';
import {
  compileArduinoCode,
  handleCreatorSaveDay,
  handleSave,
} from '../helpers';
import {
  message,
  Spin,
  Menu,
  Checkbox,
  Row,
  Col,
  Input,
  Switch,
  Alert,
} from 'antd';
import { getSaves } from '../../../Utils/requests';
import CodeModal from './CodeModal';
import ConsoleModal from './ConsoleModal';
import VersionHistoryModal from './VersionHistoryModal';
import {
  connectToPort,
  handleCloseConnection,
  handleOpenConnection,
} from '../consoleHelpers';
import ArduinoLogo from './ArduinoLogo';

export default function BlocklyCanvasPanel(props) {
  const [hoverXml, setHoverXml] = useState(false);
  const [hoverSave, setHoverSave] = useState(false);
  const [hoverUndo, setHoverUndo] = useState(false);
  const [hoverRedo, setHoverRedo] = useState(false);
  const [hoverArduino, setHoverArduino] = useState(false);
  const [hoverCompile, setHoverCompile] = useState(false);
  const [hoverConsole, setHoverConsole] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [connectionOpen, setConnectionOpen] = useState(false);
  const [selectedCompile, setSelectedCompile] = useState(false);
  const [compileError, setCompileError] = useState('');
  const [saves, setSaves] = useState({});
  const [studentToolbox, setStudentToolbox] = useState([]);
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [lastAutoSave, setLastAutoSave] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [openedToolBoxCategories, setOpenedToolBoxCategories] = useState([]);
  const [selectedToolBoxCategories, setSelectedToolBoxCategories] = useState(
    []
  );

  const [clicks, setClicks] = useState(0)
  const parser = new DOMParser();
 
  const {
    day,
    homePath,
    handleGoBack,
    isStudent,
    isMentor,
    isContentCreator,
    lessonName,
  } = props;

  const workspaceRef = useRef(null);
  const dayRef = useRef(null);
  const replayRef = useRef([]);
  const undoLength = useRef(0);
  const { SubMenu } = Menu;

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

  const handleCCGoBack = () => {
    if (
      window.confirm(
        'All unsaved progress will be lost. Do you still want to go back?'
      )
    )
      handleGoBack();
  };
  const parseXML = xml => {
    const xmlData = {
      blocks: {},
      categories: {}
    };
    let xmlDoc = parser.parseFromString(xml, "text/xml");
    console.log(xmlDoc);
    const xmlBlocks = xmlDoc.querySelectorAll('block');
    for (const block of xmlBlocks) {
      const blockType = block.getAttribute('type');
      if(xmlData.blocks[blockType]) {
        xmlData.blocks[blockType].count++;
      } else {
        xmlData.blocks[blockType] = {
          count: 1,
          deleted: 0
        };
      }
    }
    return xmlData;
  }
  const diffObjects = (currentObj, previousObj) => {
    const currentKeys = Object.keys(currentObj)
    const prevKeys = Object.keys(previousObj)
    // deleted all of one type of block
    if (prevKeys.length > currentKeys.length) {
      for(let key of prevKeys) {
        if(currentKeys.indexOf(key) === -1) {
          console.log('deleted all of one block');
          currentObj[key] = {
            count: 0,
            deleted: previousObj[key].deleted + 1
          }
        }
      }
    }
    for (let key of currentKeys) {
      if (key in previousObj) {
        if (currentObj[key].count < previousObj[key].count) {
          currentObj[key].deleted = previousObj[key].deleted + 1;
          console.log('a block was deleted');
        }
        if(currentObj[key].deleted < previousObj[key].deleted) {
          console.log('a block was reintroduced');
          currentObj[key] = {
            count: 1,
            deleted: previousObj[key].deleted
          }
        }
      }
    }

    return currentObj
  }
  const compareXML = ({blocks: currentBlocks}, {blocks: previousBlocks}) => {
    const blocks = diffObjects(currentBlocks, previousBlocks);
    return {
      blocks
    }
  }
  const handleClick = () => {
    setClicks(clicks + 1)
    console.log("Clicks: ", clicks)
  }

    return currentObj
  }
  const compareXML = ({blocks: currentBlocks}, {blocks: previousBlocks}) => {
    const blocks = diffObjects(currentBlocks, previousBlocks);
    return {
      blocks
    }
  }
  useEffect(() => {
    // automatically save workspace every min
    let autosaveInterval = setInterval(async () => {
      if (isStudent && workspaceRef.current && dayRef.current) {
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
          clicks: clicks
        };
        replayRef.current.push(replay);
        console.log(replayRef.current);
      }
    }, 1000);
    // clean up - saves workspace and removes blockly div from DOM
    return async () => {
      clearInterval(autosaveInterval);
      clearInterval(replaySaveInterval);
      if (isStudent && dayRef.current && workspaceRef.current)
        await handleSave(dayRef.current.id, workspaceRef, replayRef.current);
      if (workspaceRef.current) workspaceRef.current.dispose();
      dayRef.current = null;
    };
  }, [isStudent]);

  useEffect(() => {
    // once the day state is set, set the workspace and save
    const setUp = async () => {
      dayRef.current = day;
      if (!workspaceRef.current && day && Object.keys(day).length !== 0) {
        setWorkspace();

        if (!isStudent && !isMentor && !isContentCreator) return;

        if (isContentCreator) {
          let tempCategories = [],
            tempToolBox = [];
          day &&
            day.selectedToolbox &&
            day.selectedToolbox.forEach(([category, blocks]) => {
              tempCategories.push(category);
              tempToolBox = [
                ...tempToolBox,
                ...blocks.map((block) => block.name),
              ];
            });

          setOpenedToolBoxCategories(tempCategories);
          setStudentToolbox(tempToolBox);
        }

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
  }, [day, isStudent, isMentor, isContentCreator]);

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

  const handleCreatorSave = async () => {
    const res = await handleCreatorSaveDay(
      day.id,
      workspaceRef,
      studentToolbox
    );
    console.log(res);
    if (res.err) {
      message.error(res.err);
    } else {
      message.success('Day saved successfully');
    }
  };

  const handleSearchFilterChange = (value) => {
    let validCategories = [];

    if (value === '') {
      validCategories =
        day &&
        day.toolbox &&
        day.toolbox.reduce((accume, [category, blocks]) => {
          if (blocks.some((block) => studentToolbox.includes(block.name))) {
            return [...accume, category];
          } else {
            return accume;
          }
        }, []);
    } else {
      validCategories =
        day &&
        day.toolbox &&
        day.toolbox.reduce((accume, [category, blocks]) => {
          if (blocks.some((block) => block.name.includes(value))) {
            return [...accume, category];
          } else {
            return accume;
          }
        }, []);
    }

    setOpenedToolBoxCategories(validCategories);
    setSearchFilter(value);
  };
  /**
   * filters out blocks not in searchFilter
   * @param {object} blocks {name, description}
   */
  const applySearchFilter = (blocks) => {
    return blocks.filter((block) => block.name.includes(searchFilter));
  };

  /**
   * select or deselect entire toolbox
   * @param {object} event
   */
  const handleSelectEntireToolBox = (event) => {
    if (event.target.checked) {
      let tempToolBox = [];
      let tempCategories = [];
      day &&
        day.toolbox &&
        day.toolbox.forEach(([category, blocks]) => {
          tempCategories.push(category);
          tempToolBox = [...tempToolBox, ...blocks.map((block) => block.name)];
        });

      setSelectedToolBoxCategories(tempCategories);
      setStudentToolbox(tempToolBox);
      setSelectAll(true);
    } else {
      setStudentToolbox([]);
      setSelectedToolBoxCategories([]);
      setSelectAll(false);
    }
  };

  /**
   * select or deselect toolbox category
   * @param {boolean} checked if the switch has just be checked or not
   * @param {string} category the category being selected
   * @param {[object]} blocks the avaliable blocks inside the category
   * @param {object} event
   */
  const handleSelectToolBoxCategory = (checked, category, blocks, event) => {
    event.stopPropagation(); //prevent the submenu from being clicked on

    let blockNames = blocks.map((block) => block.name);

    if (checked) {
      setSelectedToolBoxCategories([...selectedToolBoxCategories, category]);
      setStudentToolbox([
        ...studentToolbox,
        ...blockNames.filter((item) => !studentToolbox.includes(item)),
      ]);
    } else {
      setSelectedToolBoxCategories(
        selectedToolBoxCategories.filter((item) => item !== category)
      );
      setStudentToolbox(
        studentToolbox.filter((item) => !blockNames.includes(item))
      );
      setSelectAll(false);
    }
  };

  /**
   * handle selecting a single block
   * @param {boolean} checked
   * @param {string} blockName
   * @param {string} category the category block belongs to
   */
  const handleSelectToolBoxBlock = (checked, blockName, category) => {
    //reverse, checked = just unchecked, !check = just checked
    if (checked) {
      setStudentToolbox(studentToolbox.filter((item) => item !== blockName));
      setSelectAll(false);
      setSelectedToolBoxCategories(
        selectedToolBoxCategories.filter((x) => x !== category)
      );
    } else {
      setStudentToolbox([...studentToolbox, blockName]);
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
    // if serial monitor is not shown
    if (!showConsole) {
      // connect to port
      await handleOpenConnection(9600, true);
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
      setShowConsole(false);
      if (connectionOpen) {
        await handleCloseConnection();
        setConnectionOpen(false);
      }
    }
  };

  const handleCompile = async () => {
    if (connectionOpen) {
      message.error('Close Serial Monitor before uploading your code');
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
        isStudent
      );
    }
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
            <Row>
              <Col flex='none' id='section-header'>
                {lessonName ? lessonName : 'Program your Arduino...'}
              </Col>
              <Col flex='auto'>
                <Row align='middle' justify='end' id='description-container'>
                  <Col flex={homePath && handleGoBack ? '60px' : '30px'}>
                    <Row>
                      {homePath ? (
                        <Col>
                          <Link
                            id='link'
                            to={homePath}
                            className='flex flex-column'
                          >
                            <i className='fa fa-home' />
                          </Link>
                        </Col>
                      ) : null}
                      {handleGoBack ? (
                        <Col>
                          <button
                            onClick={handleCCGoBack}
                            id='link'
                            className='flex flex-column'
                          >
                            <i id='icon-btn' className='fa fa-arrow-left' />
                          </button>
                        </Col>
                      ) : null}
                    </Row>
                  </Col>
                  <Col flex='auto' />

                  <Col flex={isStudent && lastSavedTime ? '300px' : 'auto'}>
                    {isStudent && lastSavedTime
                      ? `Last changes saved ${lastSavedTime}`
                      : null}
                  </Col>
                  <Col flex={isStudent ? '350px' : '200px'}>
                    <Row>
                      {isStudent ? (
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
                      ) : null}
                      {isContentCreator ? (
                        <Col className='flex flex-row'>
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
                        </Col>
                      ) : null}
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
                  <Col flex={isStudent ? '180px' : '230px'}>
                    <div
                      id='action-btn-container'
                      className='flex space-around'
                    >
                      {!isStudent ? (
                        <CodeModal
                          title={'XML'}
                          workspaceRef={workspaceRef.current}
                          setHover={setHoverXml}
                          hover={hoverXml}
                        />
                      ) : null}
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
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            <div id='blockly-canvas' onClick={handleClick} />
          </Spin>
        </div>
        {isContentCreator ? (
          <div id='side-container'>
            <div>
              Current Student Toolbox Selection
              <Input
                placeholder='Search Block'
                prefix={<i className='fa fa-search' />}
                onChange={(e) => handleSearchFilterChange(e.target.value)}
              />
              <Checkbox
                checked={selectAll}
                onClick={handleSelectEntireToolBox}
                disabled={searchFilter}
              >
                Select All
              </Checkbox>
              <Menu
                id='menu'
                mode='inline'
                openKeys={openedToolBoxCategories}
                onOpenChange={(keys) => setOpenedToolBoxCategories(keys)}
              >
                {
                  // Maps out block categories
                  day &&
                    day.toolbox &&
                    day.toolbox.map(([category, blocks]) => (
                      <SubMenu
                        key={category}
                        title={
                          <span>
                            <span>{category}</span>
                            {openedToolBoxCategories.some(
                              (c) => c === category
                            ) ? ( //check if the submenu is open
                              <span id='category-switch'>
                                <Switch
                                  disabled={searchFilter}
                                  checked={selectedToolBoxCategories.includes(
                                    category
                                  )}
                                  checkedChildren='category selected'
                                  unCheckedChildren='select category'
                                  onChange={(checked, event) =>
                                    handleSelectToolBoxCategory(
                                      checked,
                                      category,
                                      blocks,
                                      event
                                    )
                                  }
                                />
                              </span>
                            ) : null}
                          </span>
                        }
                      >
                        {
                          //filter out blocks not in search term
                          applySearchFilter(blocks).map((block) => {
                            return (
                              <Menu.Item key={block.name}>
                                <Checkbox
                                  checked={
                                    studentToolbox.indexOf(block.name) > -1
                                      ? true
                                      : false
                                  }
                                  onClick={(e) =>
                                    handleSelectToolBoxBlock(
                                      !e.target.checked,
                                      block.name,
                                      category
                                    )
                                  }
                                >
                                  {block.name}
                                </Checkbox>
                              </Menu.Item>
                            );
                          })
                        }
                      </SubMenu>
                    ))
                }
              </Menu>
            </div>
          </div>
        ) : null}
        <ConsoleModal
          show={showConsole}
          connectionOpen={connectionOpen}
          setConnectionOpen={setConnectionOpen}
        ></ConsoleModal>
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
