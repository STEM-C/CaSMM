import React, { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { compileArduinoCode, getArduino, getJS, getXml } from '../Workspace/helpers.js'
import "../Workspace/Workspace.less"
import { getActivityToolboxAll } from "../../Utils/requests.js"
import Logo from "../../assets/casmm_logo.png"
import { setLocalActivity } from "../Workspace/helpers";
import { getActivityToolbox } from "../../Utils/requests";
import { getToken } from "../../Utils/AuthRequests";


export default function Workspace() {

    const [activity, setActivity] = useState({} )
    const [hoverXml, setHoverXml] = useState(false)
    const [hoverJS, setHoverJS] = useState(false)
    const [hoverArduino, setHoverArduino] = useState(false)
    const [hoverCompile, setHoverCompile] = useState(false)

    let workspaceRef = useRef(null)

    const setWorkspace = () => workspaceRef.current = window.Blockly.inject('blockly-canvas', { toolbox: document.getElementById('toolbox') })

    useEffect(() => {
        const localActivity = localStorage.getItem("sandbox-activity")

        if (localActivity) {
            let loadedActivity = JSON.parse(localActivity)
            setActivity(loadedActivity)
        } else {
            getActivityToolboxAll().then(response => {
                let loadedActivity = {toolbox: response.toolbox}

                localStorage.setItem("sandbox-activity", JSON.stringify(loadedActivity))
                setActivity(loadedActivity)
            })
        }

        // clean up - removes blockly div from DOM
        return () => {
            if (workspaceRef.current) workspaceRef.current.dispose()
        }
    }, [])

    useEffect(() => {
        // once the activity state is set, set the workspace
        if (!workspaceRef.current) {
            setWorkspace()
        }
    }, [activity])

    const setLocalActivity = (workspaceRef) => {
        let workspaceDom = window.Blockly.Xml.workspaceToDom(workspaceRef)
        let workspaceText = window.Blockly.Xml.domToText(workspaceDom)
        const localActivity = JSON.parse(localStorage.getItem("sandbox-activity"))

        let lastActivity = { ...localActivity, template: workspaceText }
        localStorage.setItem("sandbox-activity", JSON.stringify(lastActivity))
    }

    return (
        <div>
            <div className="container flex flex-row">
                <div id='horizontal-container' className="flex flex-column">
                    <div id='top-container' className="flex flex-column vertical-container">
                        <div id='description-container' className="flex flex-row space-between card">
                            <Link id='link' to={"/"} className="flex flex-column">
                                <i className="fa fa-home" style={{"fontSize": "32px"}}/>
                                Home
                            </Link>
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
                </div>
            </div>

            {/* This xml is for the blocks' menu we will provide. Here are examples on how to include categories and subcategories */}
            <xml id="toolbox" style={{ "display": "none" }} is="Blockly workspace">
                {
                    // Maps out block categories
                    activity.toolbox && activity.toolbox.map(([category, blocks]) => (
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
    );

}
