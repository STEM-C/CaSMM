import React, { useEffect, useState} from "react";
import {Link} from "react-router-dom";
import AvrgirlArduino from '../../assets/avrgirl-arduino';
import "./Workspace.css";

import {compile, cms} from '../../config/development.json'

function App(props) {
    const [selectedModel, setSelectedModel] = useState(0);

    let workspace;

    // If current workspace ref is not set on initial load, set it
    useEffect(() => {
        workspace = window.Blockly.inject('blockly-canvas', {toolbox: document.getElementById('toolbox')});

        // removes blockly div from DOM
        return () => {
            workspace.dispose();
        }
    },[]);

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
        alert(code);
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
                        <i onClick={getJS} className={"fab fa-js hvr-grow"}/>
                        <i onClick={getArduino} className="hvr-grow">A</i>
                        <i onClick={compileArduinoCode} className="fas fa-play hvr-grow"/>
                    </div>
                </div>
                <div id="top-container" className="flex flex-column vertical-container">
                    <div id="description-container" className="flex flex-column card">
                        <h3>Maker Activity {props.selectedActivity.name}</h3>
                        <p><b>Instructions / Science Brief: </b>
                            {props.selectedActivity.description}</p>
                    </div>
                </div>
                <div id="bottom-container" className="flex vertical-container">
                    <div id="blockly-canvas" style={{"height": "800px", "width": "100%"}}/>
                    <div id="models-container" className="flex flex-column card space-between">
                        <h3>Activity Models</h3>
                        <img src={cms + props.selectedActivity.models[selectedModel].representation.url} alt={`model ${selectedModel}`} id="model-img"/>
                        <div id="model-btn-container" className="flex space-between">
						<span>
							<input type="radio" value={selectedModel} onClick={() => setSelectedModel(0)} name="model-btn" />
							<label htmlFor="btn-arduino">Arduino</label>
						</span>
                            <span>
							<input type="radio" value={selectedModel} onClick={() => setSelectedModel(1)} name="model-btn"/>
							<label htmlFor="btn-maker">Maker</label>
						</span>
                            <span>
							<input type="radio" value={selectedModel} onClick={() => setSelectedModel(2)} name="model-btn"/>
							<label htmlFor="btn-science">Science</label>
						</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* This xml is for the blocks' menu we will provide. Here are examples on how to include categories and subcategories */}
            <xml id="toolbox" style={{"display": "none"}} is="Blockly tag">
                {
                    // Maps out block categories
                    props.selectedActivity.blocks_categories.map((activity, i) => (
                        <category name={activity.name} is="Blockly category">
                            {
                                // maps out blocks in category
                                props.selectedActivity.blocks.map((chunk, i) => {
                                    if(chunk.name.toLowerCase().includes(activity.name.toLowerCase()))
                                            return <block type={props.selectedActivity.blocks[i].name} is="Blockly block"/>

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