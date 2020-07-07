import React, { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { compileArduinoCode, getArduino, getJS, getXml, setLocalActivity } from '../Workspace/helpers.js'
import "../Workspace/Workspace.less"
import { getActivityToolbox } from "../../Utils/requests.js"
import { getToken } from "../../Utils/AuthRequests"
import Logo from "../../assets/casmm_logo.png"
import { Carousel } from 'antd';


export default function Workspace(props) {

    const [activity, setActivity] = useState({} )
    const [hoverXml, setHoverXml] = useState(false)
    const [hoverJS, setHoverJS] = useState(false)
    const [hoverArduino, setHoverArduino] = useState(false)
    const [hoverCompile, setHoverCompile] = useState(false)

    let workspaceRef = useRef(null)

    const setWorkspace = () => workspaceRef.current = window.Blockly.inject('blockly-canvas', { toolbox: document.getElementById('toolbox') })

    useEffect(() => {
        const localActivity = localStorage.getItem("my-activity")
        const {selectedActivity} = props

        if (localActivity && !selectedActivity) {
            let loadedActivity = JSON.parse(localActivity)
            setActivity(loadedActivity)

        } else if (selectedActivity) {
            getActivityToolbox(selectedActivity.id, getToken()).then(response => {
                let loadedActivity = {...selectedActivity, toolbox: response.toolbox}

                localStorage.setItem("my-activity", JSON.stringify(loadedActivity))
                setActivity(loadedActivity)
            })
        } else {
            props.history.push('/')
        }

        // clean up - removes blockly div from DOM
        return () => {
            if (workspaceRef.current) workspaceRef.current.dispose()
        }
    }, [props])

    useEffect(() => {
        // once the activity state is set, set the workspace
        if (Object.keys(activity).length && !workspaceRef.current) {
            setWorkspace()
            workspaceRef.current.addChangeListener(() => setLocalActivity(workspaceRef.current))

            if (activity.template) {
                let xml = window.Blockly.Xml.textToDom(activity.template)
                window.Blockly.Xml.domToWorkspace(xml, workspaceRef.current)
            }
        }
    }, [activity])

    return (
        <div>
            <div className="container flex flex-row">
                <div id='horizontal-container' className="flex flex-column">
                    <div id='top-container' className="flex flex-column vertical-container">
                        <div id='description-container' className="flex flex-row space-between card">
                            <Link id='link' to={"/student"} className="flex flex-column">
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
