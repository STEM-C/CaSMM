import React, {useEffect, useRef, useState} from 'react';
import {Link} from "react-router-dom";
import '../DayPanels.less'
import {compileArduinoCode, setLocalActivity, handleSave} from "../helpers";
import {message} from "antd";
import {getSaves} from "../../../Utils/requests";
import CodeModal from "./CodeModal";
import VersionHistoryModal from "./VersionHistoryModal"

export default function BlocklyCanvasPanel(props) {
    const [hoverXml, setHoverXml] = useState(false);
    const [hoverArduino, setHoverArduino] = useState(false);
    const [hoverCompile, setHoverCompile] = useState(false);
    const [saves, setSaves] = useState({});
    const [lastSavedTime, setLastSavedTime] = useState(null)
    const {day, dayType, homePath, handleGoBack, isStudent, lessonName} = props;


    let workspaceRef = useRef(null);
    let dayRef = useRef(null);
    let isStudentRef = useRef(null);

    const setWorkspace = () =>
        workspaceRef.current = window.Blockly.inject('blockly-canvas',
            {toolbox: document.getElementById('toolbox')}
        );

    const loadSave = selectedSave => {
        try {
            let toLoad = day.template;
            if (selectedSave !== -1) {

                if (saves.current && saves.current.id === selectedSave) {
                    toLoad = saves.current.workspace;
                    setLastSavedTime(getFormattedDate(saves.current.updated_at));
                } else {
                    const s = saves.past.find(save => save.id === selectedSave);
                    toLoad = s.workspace;
                    setLastSavedTime(getFormattedDate(s.updated_at))
                }
            }
            let xml = window.Blockly.Xml.textToDom(toLoad);
            if (workspaceRef.current) workspaceRef.current.clear();
            window.Blockly.Xml.domToWorkspace(xml, workspaceRef.current);
            //setSelectedSave(-2)
        } catch (e) {
            message.error('Failed to load save.')
        }
    };

    useEffect(() => {
        // automatically save workspace every 5 min
        setInterval(async () => {
            if (isStudentRef.current && workspaceRef.current && dayRef.current) {
                const res = await handleSave(dayRef.current.id, workspaceRef)
                if (res.data) {
                    setLastSavedTime(getFormattedDate(res.data[0].updated_at));
                }
            }
        }, 60000);

        // clean up - saves workspace and removes blockly div from DOM
        return async () => {
            if (isStudentRef.current && dayRef.current && workspaceRef.current)
                await handleSave(dayRef.current.id, workspaceRef);
            if (workspaceRef.current) workspaceRef.current.dispose();
            isStudentRef.current = null;
            dayRef.current = null
        }
    }, []);

    useEffect(() => {
        // once the day state is set, set the workspace and save
        const setUp = async () => {
            isStudentRef.current = isStudent;
            dayRef.current = day
            if (!workspaceRef.current && day && Object.keys(day).length !== 0) {
                setWorkspace();
                await workspaceRef.current.addChangeListener(() => setLocalActivity(workspaceRef.current, dayType));

                let onLoadSave = null;
                if (isStudent) {
                    const res = await getSaves(day.id);
                    if (res.data) {
                        if (res.data.current) onLoadSave = res.data.current;
                        setSaves(res.data)
                    } else {
                        console.log(res.err)
                    }
                }

                if (onLoadSave) {
                    let xml = window.Blockly.Xml.textToDom(onLoadSave.workspace);
                    window.Blockly.Xml.domToWorkspace(xml, workspaceRef.current);
                    setLastSavedTime(getFormattedDate(onLoadSave.updated_at));
                } else if (day.template) {
                    let xml = window.Blockly.Xml.textToDom(day.template);
                    window.Blockly.Xml.domToWorkspace(xml, workspaceRef.current)
                }
            }
        };
        setUp()
    }, [day, dayType, isStudent]);

    const handleManualSave = async () => {
        // save workspace then update load save options
        const res = await handleSave(day.id, workspaceRef);
        if (res.err) {
            message.error(res.err)
        } else {
            setLastSavedTime(getFormattedDate(res.data[0].updated_at));
            console.log(getFormattedDate(res.data[0].updated_at))
            message.success('Workspace saved successfully.')
        }

        const savesRes = await getSaves(day.id);
        if (savesRes.data) setSaves(savesRes.data);
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
        const sec = d.getSeconds();
        return `${month}/${day}/${year}, ${hrs}:${min}:${sec} ${ampm}`
    };

    return (
        <div id='horizontal-container' className="flex flex-column">
            <div id='top-container' className="flex flex-column vertical-container">
                <div id='description-container' className="flex flex-row space-between card">
                    <div className='flex flex-row'>
                        {homePath ? <Link id='link' to={homePath} className="flex flex-column">
                            <i className="fa fa-home"/>
                        </Link> : null}
                        {handleGoBack ? <button onClick={handleGoBack} id='link' className="flex flex-column">
                            <i id='icon-btn' className="fa fa-arrow-left"/>
                        </button> : null}
                    </div>
                    <div>
                        {isStudent && lastSavedTime ?
                            `Last changes saved ${lastSavedTime}`
                            : null
                        }
                    </div>
                    {isStudent ?
                        <div className='flex flex-row'>
                            {/*<select id='save-select' value={selectedSave} onChange={(e) => {*/}
                            {/*    setSelectedSave(parseInt(e.target.value))*/}
                            {/*}}>*/}
                            {/*    <option key={-2} value={-2} disabled id='disabled-option'>*/}
                            {/*        Load Saves*/}
                            {/*    </option>*/}
                            {/*    <option key={-1} value={-1}>*/}
                            {/*        Default Template*/}
                            {/*    </option>*/}
                            {/*    {saves.current ? <option value={saves.current.id} key={saves.current.id}>*/}
                            {/*        {'Active Save'}*/}
                            {/*    </option> : null}*/}
                            {/*    {saves.past ? saves.past.map(save =>*/}
                            {/*        <option value={save.id} key={save.id}>*/}
                            {/*            {`${save.student.name}'s Save */}
                            {/*            ${save.updated_at.slice(5, 7)}/${save.updated_at.slice(8, 10)}`}*/}
                            {/*        </option>) : null}*/}
                            {/*</select>*/}
                            {/*<button onClick={loadSave} id='link' className="flex flex-column">*/}
                            {/*    <i id='icon-btn' className="fa fa-folder-open"/>*/}
                            {/*</button>*/}
                            <VersionHistoryModal
                                saves={saves}
                                defaultTemplate={day}
                                getFormattedDate={getFormattedDate}
                                loadSave={loadSave}
                            />
                            <button onClick={handleManualSave} id='link' className="flex flex-column">
                                <i id='icon-btn' className="fa fa-save"/>
                            </button>
                        </div>
                        : null
                    }
                    <div style={{"width": "10%"}}>
                        <div id='action-btn-container' className="flex space-between">
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
                            <i onClick={() => compileArduinoCode(workspaceRef.current)}
                               className="fas fa-upload hvr-info"
                               onMouseEnter={() => setHoverCompile(true)}
                               onMouseLeave={() => setHoverCompile(false)}/>
                            {hoverCompile && <div className="popup Compile">Upload to Arduino</div>}
                        </div>
                    </div>
                </div>
            </div>
            <div id='bottom-container' className="flex flex-column vertical-container overflow-visible">
                <div id="section-header">
                    {lessonName ? lessonName : "Program your Arduino..."}
                </div>
                <div id="blockly-canvas"
                     onChange={() => setLocalActivity(workspaceRef.current)}/>
            </div>

            {/* This xml is for the blocks' menu we will provide. Here are examples on how to include categories and subcategories */}
            <xml id="toolbox" style={{"display": "none"}} is="Blockly workspace">
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
