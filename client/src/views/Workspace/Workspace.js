import React, { useEffect, useState, useRef} from "react"
import {Link} from "react-router-dom"
import "./Workspace.css"
import {getJS, getArduino, compileArduinoCode} from './helpers.js'

function App(props) {
    const [hoverJS, setHoverJS] = useState(false);
    const [hoverArduino, setHoverArduino] = useState(false);
    const [hoverCompile, setHoverCompile] = useState(false);
    let workspaceRef = useRef(null);

    // If current workspace ref is not set on initial load, set it, otherwise set as prop value
    const data = localStorage.getItem("my-activity");
    const selectedActivity = (data && !props.selectedActivity) ? JSON.parse(data) : props.selectedActivity;

    useEffect(() => {
        workspaceRef.current = window.Blockly.inject('blockly-canvas', {toolbox: document.getElementById('toolbox')});

        // removes blockly div from DOM
        return () => {
            workspaceRef.current.dispose();
        }
    },[]);

    // saves activity in localstorage
    useEffect(() => {
        localStorage.setItem("my-activity", JSON.stringify(selectedActivity));
    });

    return (
        <div>
            <div id="container" className="flex flex-column">
                <div id="nav-container" className="flex vertical-container space-between">
                    <h1 id="title"><Link to={"/"}>STEM+C</Link></h1>
                    <div id="action-btn-container" className="flex space-between">
                        <i onClick={() => getJS(workspaceRef.current)} className="fab fa-js hvr-info" onMouseEnter={() => setHoverJS(true)}
                           onMouseLeave={() => setHoverJS(false)}/>
                        {hoverJS && <div className="popup JS">Shows Javascript Code</div>}
                        <i onClick={() => getArduino(workspaceRef.current)} className="hvr-info" onMouseEnter={() => setHoverArduino(true)}
                           onMouseLeave={() => setHoverArduino(false)}>A</i>
                        {hoverArduino && <div className="popup Arduino">Shows Arduino Code</div>}
                        <i onClick={() => compileArduinoCode(workspaceRef.current)} className="fas fa-play hvr-info" onMouseEnter={() => setHoverCompile(true)}
                           onMouseLeave={() => setHoverCompile(false)}/>
                        {hoverCompile && <div className="popup Compile">Run Program</div>}
                    </div>
                </div>
                <div id="top-container" className="flex flex-column vertical-container">
                    <div id="description-container" className="flex flex-column card">
                        <h3>Maker Activity {selectedActivity.name}</h3>
                        <p><b>Instructions / Science Brief: </b>
                            {selectedActivity.description}</p>
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
                    selectedActivity.toolbox.map(([activity, blocks]) => (
                        <category name={activity} is="Blockly category" key={activity}>
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