import React, { useEffect, useState} from "react";
import {Link} from "react-router-dom";
import * as AvrgirlArduino from '../../assets/avrgirl-arduino';
import "./Workspace.css";

import {compile} from '../../hosts.js'

function App(props) {
    const [hoverJS, setHoverJS] = useState(false);
    const [hoverArduino, setHoverArduino] = useState(false);
    const [hoverCompile, setHoverCompile] = useState(false);

    let workspace;

    // If current workspace ref is not set on initial load, set it, otherwise set as prop value
    const data = localStorage.getItem("my-activity");
    const selectedActivity = (data && !props.selectedActivity) ? JSON.parse(data) : props.selectedActivity;

    useEffect(() => {
        workspace = window.Blockly.inject('blockly-canvas', {toolbox: document.getElementById('toolbox')});

        // removes blockly div from DOM
        return () => {
            workspace.dispose();
        }
    },[]);

    // saves activity in localstorage
    useEffect(() => {
        localStorage.setItem("my-activity", JSON.stringify(selectedActivity));
    });

    // Generates javascript code from blockly canvas
    const getJS = () => {
        window.Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
        let code = window.Blockly.JavaScript.workspaceToCode(workspace);
        alert(code)
        return(code);
    };

    // Generates Arduino code from blockly canvas
    const getArduino = () => {
        window.Blockly.Arduino.INFINITE_LOOP_TRAP = null;
        let code = window.Blockly.Arduino.workspaceToCode(workspace);
        return(code);
    };

    // Sends compiled arduino code to server and returns hex to flash board with
    const compileArduinoCode = async() => {
        let body = {
            "board": "arduino:avr:uno",
            "sketch": getArduino()
        };

        // gets compiled hex from server
        let Hex;
        window.$.post(`${compile}/compile`, body, (data) => {
            // converting base 64 to hex
            Hex = atob(data.hex).toString();

            const avrgirl = new AvrgirlArduino({
                board: "",
                debug: true
            });

            avrgirl.flash(Hex, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('done correctly.');
                }
            })

        });
    };

    return (
        <div>
            <div id="container" className="flex flex-column">
                <div id="nav-container" className="flex vertical-container space-between">
                    <h1 id="title"><Link to={"/Home"}>STEM+C</Link></h1>
                    <div id="action-btn-container" className="flex space-between">
                        <i onClick={getJS} className="fab fa-js hvr-info" onMouseEnter={() => setHoverJS(true)}
                           onMouseLeave={() => setHoverJS(false)}/>
                        {hoverJS && <div className="popup JS">Shows Javascript Code</div>}
                        <i onClick={getArduino} className="hvr-info" onMouseEnter={() => setHoverArduino(true)}
                           onMouseLeave={() => setHoverArduino(false)}>A</i>
                        {hoverArduino && <div className="popup Arduino">Shows Arduino Code</div>}
                        <i onClick={compileArduinoCode} className="fas fa-play hvr-info" onMouseEnter={() => setHoverCompile(true)}
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
            <xml id="toolbox" style={{"display": "none"}} is="Blockly tag">
                {
                    // Maps out block categories
                    selectedActivity.blocks_categories.map((activity, i) => (
                        <category name={activity.name} is="Blockly category" key={activity.name}>
                            {
                                // maps out blocks in category
                                selectedActivity.blocks.map((chunk, i) => {
                                    if(chunk.name.toLowerCase().includes(activity.name.toLowerCase()))
                                            return <block type={selectedActivity.blocks[i].name} is="Blockly block" key={activity.name + i}/>
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