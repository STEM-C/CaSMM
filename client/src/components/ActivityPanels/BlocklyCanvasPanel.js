import React, {useEffect, useRef, useState} from 'react';
import {Link} from "react-router-dom";
import './ActivityPanels.less'
import {compileArduinoCode, getArduino, getJS, getXml, setLocalActivity} from "./helpers";

export default function BlocklyCanvasPanel(props) {
    const [hoverXml, setHoverXml] = useState(false)
    const [hoverJS, setHoverJS] = useState(false)
    const [hoverArduino, setHoverArduino] = useState(false)
    const [hoverCompile, setHoverCompile] = useState(false)
    const {activity, activityType, homePath, toActivityList, handleLogout} = props


    let workspaceRef = useRef(null)

    const setWorkspace = () => workspaceRef.current = window.Blockly.inject('blockly-canvas', {toolbox: document.getElementById('toolbox')})

    useEffect(() => {
        // clean up - removes blockly div from DOM
        return () => {
            if (workspaceRef.current) workspaceRef.current.dispose()
        }
    }, [])

    useEffect(() => {
        // once the activity state is set, set the workspace
        if (!workspaceRef.current && activity && Object.keys(activity).length !== 0) {
            setWorkspace()
            workspaceRef.current.addChangeListener(() => setLocalActivity(workspaceRef.current, activityType))

            if (activity.template) {
                let xml = window.Blockly.Xml.textToDom(activity.template)
                window.Blockly.Xml.domToWorkspace(xml, workspaceRef.current)
            }
        }
    }, [activity, activityType])

    return (
        <div id='horizontal-container' className="flex flex-column">
            <div id='top-container' className="flex flex-column vertical-container">
                <div id='description-container' className="flex flex-row space-between card">
                    <div className='flex flex-row'>
                        <Link id='link' to={homePath} className="flex flex-column">
                            <i className="fa fa-home"/>
                        </Link>
                        {toActivityList ? <button onClick={toActivityList} id='link' className="flex flex-column">
                            <i id='icon-btn' className="fa fa-th"/>
                        </button> : null}
                        {handleLogout ? <button onClick={handleLogout} id='link' className="flex flex-column">
                            <i id='icon-btn' className="fa fa-sign-out-alt"/>
                        </button> : null}
                    </div>
                    <div style={{"width": "25%"}}>
                        <div id='action-btn-container' className="flex space-between">
                            <i onClick={() => getXml(workspaceRef.current)} className="fas fa-code hvr-info"
                               onMouseEnter={() => setHoverXml(true)}
                               onMouseLeave={() => setHoverXml(false)}/>
                            {hoverXml && <div className="popup XML">Shows Xml Code</div>}
                            <i onClick={() => getJS(workspaceRef.current)} className="fab fa-js hvr-info"
                               onMouseEnter={() => setHoverJS(true)}
                               onMouseLeave={() => setHoverJS(false)}/>
                            {hoverJS && <div className="popup JS">Shows Javascript Code</div>}
                            <i onClick={() => getArduino(workspaceRef.current)} className="hvr-info"
                               onMouseEnter={() => setHoverArduino(true)}
                               onMouseLeave={() => setHoverArduino(false)}>A</i>
                            {hoverArduino && <div className="popup Arduino">Shows Arduino Code</div>}
                            <i onClick={() => compileArduinoCode(workspaceRef.current)}
                               className="fas fa-play hvr-info"
                               onMouseEnter={() => setHoverCompile(true)}
                               onMouseLeave={() => setHoverCompile(false)}/>
                            {hoverCompile && <div className="popup Compile">Run Program</div>}
                        </div>
                    </div>
                </div>
            </div>
            <div id='bottom-container' className="flex flex-column vertical-container overflow-visible">
                <div id="section-header">
                    Program your Arduino...
                </div>
                <div id="blockly-canvas"
                     onChange={() => setLocalActivity(workspaceRef.current)}/>
            </div>

            {/* This xml is for the blocks' menu we will provide. Here are examples on how to include categories and subcategories */}
            <xml id="toolbox" style={{"display": "none"}} is="Blockly workspace">
                {
                    // Maps out block categories
                    activity && activity.toolbox && activity.toolbox.map(([category, blocks]) => (
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
