import React, { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { compileArduinoCode, getArduino, getJS } from './helpers.js'
import "./Workspace.css"
import { getActivityToolbox } from "../../dataaccess/requests.js"

function App(props) {

    const [activity, setActivity] = useState({})
    const [hoverJS, setHoverJS] = useState(false)
    const [hoverArduino, setHoverArduino] = useState(false)
    const [hoverCompile, setHoverCompile] = useState(false)

    let workspaceRef = useRef(null)
    const setWorkspace = () => workspaceRef.current = window.Blockly.inject('blockly-canvas', {toolbox: document.getElementById('toolbox')})

    useEffect(() => {
        const localActivity = localStorage.getItem("my-activity")
        const {selectedActivity} = props

        if (localActivity && !selectedActivity) {

            let loadedActivity = JSON.parse(localActivity)
            setActivity(loadedActivity)

        } else if (selectedActivity) {

            getActivityToolbox(selectedActivity.id).then(response => {

                let loadedActivity = {...selectedActivity, toolbox: response.toolbox}

                localStorage.setItem("my-activity", JSON.stringify(loadedActivity))
                setActivity(loadedActivity)
            })
        } else {
            window.location = '/' // this should probably use the react router dom to add to history stack
        }

        // clean up - removes blockly div from DOM 
        return () => {
            workspaceRef.current.dispose()
        }
    }, [props])

    useEffect(() => {

        // once the activity state is set, set the workspace
        if (Object.keys(activity).length && !workspaceRef.current) setWorkspace()
    }, [activity])

    return (
        <div>
            <div id="container" className="flex flex-column">
                <div id="nav-container" className="flex vertical-container space-between">
                    <h1 id="title"><Link to={"/"}>STEM+C</Link></h1>
                    <div id="action-btn-container" className="flex space-between">
                        <i onClick={() => getJS(workspaceRef.current)} className="fab fa-js hvr-info"
                           onMouseEnter={() => setHoverJS(true)}
                           onMouseLeave={() => setHoverJS(false)}/>
                        {hoverJS && <div className="popup JS">Shows Javascript Code</div>}
                        <i onClick={() => getArduino(workspaceRef.current)} className="hvr-info"
                           onMouseEnter={() => setHoverArduino(true)}
                           onMouseLeave={() => setHoverArduino(false)}>A</i>
                        {hoverArduino && <div className="popup Arduino">Shows Arduino Code</div>}
                        <i onClick={() => compileArduinoCode(workspaceRef.current)} className="fas fa-play hvr-info"
                           onMouseEnter={() => setHoverCompile(true)}
                           onMouseLeave={() => setHoverCompile(false)}/>
                        {hoverCompile && <div className="popup Compile">Run Program</div>}
                    </div>
                </div>
                <div id="top-container" className="flex flex-column vertical-container">
                    <div id="description-container" className="flex flex-column card">
                        <h3>Maker Activity {activity.name}</h3>
                        <p><b>Instructions / Science Brief: </b>
                            {activity.description}</p>
                    </div>
                </div>
                <div id="bottom-container" className="flex vertical-container">
                    <div id="blockly-canvas" style={{"height": "800px", "width": "100%"}}/>
                </div>
            </div>

            {/* This xml is for the blocks' menu we will provide. Here are examples on how to include categories and subcategories */}
            <xml id="toolbox" style={{"display": "none"}} is="Blockly workspace">
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

export default App;