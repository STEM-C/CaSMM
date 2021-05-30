import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import '../DayPanels.less'
import { compileArduinoCode, handleCreatorSaveDay, handleSave } from "../helpers";
import { message, Spin, Menu, Checkbox, Row, Col, Input, Switch } from "antd";
import { getSaves } from "../../../Utils/requests";
import CodeModal from "./CodeModal";
import VersionHistoryModal from "./VersionHistoryModal"

export default function BlocklyCanvasPanel(props) {
    const [hoverXml, setHoverXml] = useState(false);
    const [hoverArduino, setHoverArduino] = useState(false);
    const [hoverCompile, setHoverCompile] = useState(false);
    const [selectedCompile, setSelectedCompile] = useState(false);
    const [saves, setSaves] = useState({});
    const [studentToolbox, setStudentToolbox] = useState([]);
    const [lastSavedTime, setLastSavedTime] = useState(null);
    const [lastAutoSave, setLastAutoSave] = useState(null);
    const [searchFilter, setSearchFilter] = useState('');
    const [selectAll, setSelectAll] = useState(false);
    const [openedToolBoxCategories, setOpenedToolBoxCategories] = useState([]);
    const [selectedToolBoxCategories, setSelectedToolBoxCategories] = useState([]);

    const { day, homePath, handleGoBack, isStudent, isMentor, isContentCreator, lessonName } = props;

    const workspaceRef = useRef(null);
    const dayRef = useRef(null);
    const { SubMenu } = Menu;

    const setWorkspace = () =>
        workspaceRef.current = window.Blockly.inject('blockly-canvas',
            { toolbox: document.getElementById('toolbox') }
        );

    const loadSave = selectedSave => {
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
                    const s = saves.past.find(save => save.id === selectedSave);
                    if (s) {
                        toLoad = s.workspace;
                        setLastSavedTime(getFormattedDate(s.updated_at))
                    } else {
                        message.error('Failed to restore save.')
                        return
                    }
                }
            } else {
                setLastSavedTime(null)
            }
            let xml = window.Blockly.Xml.textToDom(toLoad);
            if (workspaceRef.current) workspaceRef.current.clear();
            window.Blockly.Xml.domToWorkspace(xml, workspaceRef.current);
            workspaceRef.current.clearUndo()
        } catch (e) {
            message.error('Failed to load save.')
        }
    };

    useEffect(() => {
        // automatically save workspace every min
        setInterval(async () => {
            if (isStudent && workspaceRef.current && dayRef.current) {
                const res = await handleSave(dayRef.current.id, workspaceRef);
                if (res.data) {
                    setLastAutoSave(res.data[0]);
                    setLastSavedTime(getFormattedDate(res.data[0].updated_at))
                }
            }
        }, 60000);

        // clean up - saves workspace and removes blockly div from DOM
        return async () => {
            if (isStudent && dayRef.current && workspaceRef.current)
                await handleSave(dayRef.current.id, workspaceRef);
            if (workspaceRef.current) workspaceRef.current.dispose();
            dayRef.current = null
        }
    }, [isStudent]);

    useEffect(() => {
        // once the day state is set, set the workspace and save
        const setUp = async () => {
            dayRef.current = day;
            if (!workspaceRef.current && day && Object.keys(day).length !== 0) {
                setWorkspace();

                if (!isStudent && !isMentor && !isContentCreator) return;

                let onLoadSave = null;
                const res = await getSaves(day.id);
                if (res.data) {
                    if (res.data.current) onLoadSave = res.data.current;
                    setSaves(res.data)
                } else {
                    console.log(res.err)
                }

                if (onLoadSave) {
                    let xml = window.Blockly.Xml.textToDom(onLoadSave.workspace);
                    window.Blockly.Xml.domToWorkspace(xml, workspaceRef.current);
                    setLastSavedTime(getFormattedDate(onLoadSave.updated_at));
                } else if (day.template) {
                    let xml = window.Blockly.Xml.textToDom(day.template);
                    window.Blockly.Xml.domToWorkspace(xml, workspaceRef.current)
                }

                workspaceRef.current.clearUndo()
            }
        };
        setUp()
    }, [day, isStudent, isMentor, isContentCreator]);

    const handleManualSave = async () => {
        // save workspace then update load save options
        const res = await handleSave(day.id, workspaceRef);
        if (res.err) {
            message.error(res.err)
        } else {
            setLastSavedTime(getFormattedDate(res.data[0].updated_at));
            message.success('Workspace saved successfully.')
        }

        const savesRes = await getSaves(day.id);
        if (savesRes.data) setSaves(savesRes.data);
    };

    const handleCreatorSave = async () => {
        const res = handleCreatorSaveDay(day.id, workspaceRef, studentToolbox);
        if (res.err) {
            message.error(res.err)
        } else {
            message.success('Day saved successfully')
        }
    }

    /**
     * filters out blocks not in searchFilter
     * @param {object} blocks {name, description} 
     */
    const applySearchFilter = (blocks) => {

        return blocks.filter(block => block.name.includes(searchFilter));
    
    }

    /**
     * select or deselect entire toolbox under the current search filter
     * @param {object} event 
     */
    const handleSelectEntireToolBox = (event) => {

        if(event.target.checked){
            let tempToolBox = [];
            let tempCategories = [];
            day && day.toolbox && day.toolbox.forEach(
                ([category, blocks]) => {
                    tempCategories.push(category);
                    applySearchFilter(blocks).forEach((block) => {
                        tempToolBox.push(block.name);
                    })
                }
            );

            setSelectedToolBoxCategories(tempCategories);
            setStudentToolbox(tempToolBox);
            setSelectAll(true);
        }
        else{
            setStudentToolbox([]);
            setSelectedToolBoxCategories([]);
            setSelectAll(false);
        }
    }

    /**
     * select or deselect toolbox category based on current search filter
     * @param {boolean} checked if the switch has just be checked or not 
     * @param {string} category the category being selected
     * @param {[object]} blocks the avaliable blocks inside the category under search filter
     * @param {object} event 
     */
    const handleSelectToolBoxCategory = (checked, category, blocks, event) => {

        event.stopPropagation(); //prevent the submenu from being clicked on

        let blockNames = blocks.map(block => block.name);

        if (checked) {
            setSelectedToolBoxCategories([...selectedToolBoxCategories, category])
            setStudentToolbox([...studentToolbox, ...blockNames.filter(item => !studentToolbox.includes(item))]);
        }
        else {
            setSelectedToolBoxCategories(selectedToolBoxCategories.filter(item => item !== category))
            setStudentToolbox(studentToolbox.filter(item => !blockNames.includes(item)));
            setSelectAll(false);
        }
    }

    /**
     * handle selecting a single block
     * @param {boolean} checked 
     * @param {string} blockName 
     */
    const handleToolboxSelection = (checked, blockName) => {

        //reverse, checked = just unchecked, !check = just checked
        if (checked) {
            setStudentToolbox(studentToolbox.filter(item => item !== blockName));
            setSelectAll(false);
        }
        else {
            setStudentToolbox([...studentToolbox, blockName]);
        }
    }

    /** set opened categories to the passed in categories
     * 
     * @param {[string]} categories 
     */
    const openCategories = (categories) => {

        if (categories) {
            setOpenedToolBoxCategories(categories);
        }
        
    }

    const handleUndo = () => {
        if (workspaceRef.current.undoStack_.length > 0)
            workspaceRef.current.undo(false)
    };

    const handleRedo = () => {
        if (workspaceRef.current.redoStack_.length > 0)
            workspaceRef.current.undo(true)
    };

    const getFormattedDate = dt => {
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
        return `${month}/${day}/${year}, ${hrs}:${min}:${sec} ${ampm}`
    };

    return (

        <div id='horizontal-container' className="flex flex-column">
            
            <div className='flex flex-row'>
                <div id='bottom-container' className="flex flex-column vertical-container overflow-visible">
                    <Row>
                        <Col flex="none" id="section-header">
                            {lessonName ? lessonName : "Program your Arduino..."}
                        </Col>
                        <Col flex="auto">
                        
                        <Spin tip="Compiling Code Please Wait..." className="compilePop" spinning={selectedCompile}>
                            
                            <Row align='middle' justify='end' id='description-container' >
                                <Col span={1}>
                                    <Row>
                                        {homePath ? 
                                        <Col>
                                            <Link id='link' to={homePath} className="flex flex-column">
                                                <i className="fa fa-home"/>
                                            </Link>
                                        </Col>
                                         : null}
                                        {handleGoBack ? 
                                        <Col>
                                            <button onClick={handleGoBack} id='link' className="flex flex-column">
                                                <i id='icon-btn' className="fa fa-arrow-left"/>
                                            </button>
                                        </Col>
                                         : null}
                                    </Row>
                                </Col>
                                <Col flex='auto' />
                            
                                <Col span={6}>
                                    {isStudent && lastSavedTime ?
                                        `Last changes saved ${lastSavedTime}`
                                        : null
                                    }
                                </Col>
                                <Col span={isStudent? 8 : 5}>
                                    <Row>
                                    {isStudent ?
                                        <Col className='flex flex-row'>
                                            <VersionHistoryModal
                                                saves={saves}
                                                lastAutoSave={lastAutoSave}
                                                defaultTemplate={day}
                                                getFormattedDate={getFormattedDate}
                                                loadSave={loadSave}
                                            />
                                            <button onClick={handleManualSave} id='link' className="flex flex-column">
                                                <i id='icon-btn' className="fa fa-save"/>
                                            </button>
                                        </Col>
                                        : null
                                    }
                                    {isContentCreator ?
                                        <Col className='flex flex-row'>
                                            <button onClick={handleCreatorSave} id='link' className="flex flex-column">
                                                <i id='icon-btn' className="fa fa-save"/>
                                            </button>
                                        </Col>
                                        : null}
                                    <Col className='flex flex-row'>
                                        <button onClick={handleUndo} id='link' className="flex flex-column">
                                            <i id='icon-btn' className="fa fa-undo-alt"
                                            style={workspaceRef.current ?
                                                workspaceRef.current.undoStack_.length < 1 ?
                                                    { color: 'grey', cursor: 'default' } : null
                                                : null}
                                            />
                                        </button>
                                        <button onClick={handleRedo} id='link' className="flex flex-column">
                                            <i id='icon-btn' className="fa fa-redo-alt"
                                            style={workspaceRef.current ?
                                                workspaceRef.current.redoStack_.length < 1 ?
                                                    { color: 'grey', cursor: 'default' } : null
                                                : null}
                                            />
                                        </button>
                                    </Col>
                                    </Row>
                                    
                                </Col>
                                <Col span={isStudent ? 3: 5}>
                                    <div id='action-btn-container' className="flex space-around">
                                        {!isStudent ?
                                            <CodeModal
                                                title={'XML'}
                                                workspaceRef={workspaceRef.current}
                                                setHover={setHoverXml}
                                                hover={hoverXml}
                                            />
                                            : null}
                                        <CodeModal
                                            title={'Arduino Code'}
                                            workspaceRef={workspaceRef.current}
                                            setHover={setHoverArduino}
                                            hover={hoverArduino}
                                        />
                                        <i onClick={() => compileArduinoCode(workspaceRef.current, setSelectedCompile, day, isStudent)}
                                        className="fas fa-upload hvr-info"
                                        onMouseEnter={() => setHoverCompile(true)}
                                        onMouseLeave={() => setHoverCompile(false)}/>
                                        {hoverCompile && <div className="popup ModalCompile">Upload to Arduino</div>}
                                    </div>
                                </Col>
                            </Row>
                        
                        </Spin>
                        </Col>
                    </Row>
                   
                    <div id="blockly-canvas"/>
                </div>
                {isContentCreator ?
                    <div id='side-container'>
                        Current Student Toolbox Selection

                        <Input
                            placeholder="Search Block"
                            prefix={<i className="fa fa-search" />}
                            onChange={e => setSearchFilter(e.target.value)}
                            onInput={() => openCategories(day && day.toolbox &&
                                day.toolbox.reduce((accume, curr) => [...accume, curr[0]], []))}
                        />

                        <Checkbox
                            checked={selectAll}
                            onClick={handleSelectEntireToolBox}>
                        Select All
                        </Checkbox>
                        
                        <Menu
                            mode="inline"
                            openKeys={openedToolBoxCategories}
                            onOpenChange={keys => setOpenedToolBoxCategories(keys)}
                        >
                                
                            {
                                // Maps out block categories
                                day && day.toolbox && day.toolbox.map(([category, blocks]) => (
                                    <SubMenu
                                        key={category}
                                        title={
                                            <span>
                                                <span>{category}</span>
                                                {openedToolBoxCategories.some(c => c === category) ? //check if the submenu is open
                                                <span id="category-switch">
                                                    <Switch
                                                        checked={selectedToolBoxCategories.includes(category)}
                                                        checkedChildren="category selected" unCheckedChildren="select category"
                                                        onChange={(checked, event) => handleSelectToolBoxCategory(checked, category, applySearchFilter(blocks), event)} />
                                                </span>
                                                : null
                                                }
                                            </span>
                                    }>
                                        {
                                            //filter out blocks not in search term
                                            applySearchFilter(blocks).map((block) => {
                                                return(
                                                    <Menu.Item key={block.name}>
                                                        <Checkbox 
                                                            checked={studentToolbox.indexOf(block.name) > -1 ? true : false}
                                                            onClick={e => handleToolboxSelection(!e.target.checked, block.name)}
                                                        >{block.name}</Checkbox>
                                                    </Menu.Item>
                                                )
                                        })
                                        }
                                    </SubMenu>
                                ))
                            }
                        </Menu>
                    </div>
                    : null}
            </div>

            {/* This xml is for the blocks' menu we will provide. Here are examples on how to include categories and subcategories */}
            <xml id="toolbox" is="Blockly workspace">
                {
                    // Maps out block categories
                    day && day.toolbox && day.toolbox.map(([category, blocks]) => (
                        <category name={category} is="Blockly category" key={category}>
                            {
                                // maps out blocks in category
                                // eslint-disable-next-line
                                blocks.map((block) => {
                                    return <block type={block.name} is="Blockly block" key={block.name}/>
                                })
                            }
                        </category>
                    ))
                }
            </xml>

        </div>
    )
}