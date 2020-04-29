import React, {useState, useEffect, useRef} from "react";
import AvrgirlArduino from './avrgirl-arduino';
import "./App.css";

import {cms, compile} from './config/development.json'

function App() {
    let workspace;

    // If current workspace ref is not set on initial load, set it
    useEffect(() => {
        workspace = window.Blockly.inject('blockly-canvas', {toolbox: document.getElementById('toolbox')});
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

            // TODO: Remove hardcoded file path
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
                <h1 id="title">STEM+C</h1>
                <div id="action-btn-container" className="flex space-between">
                    <i onClick={getJS} className={"fab fa-js hvr-grow"}/>
                    <i onClick={getArduino} className="hvr-grow">A</i>
                    <i onClick={compileArduinoCode} className="fas fa-play hvr-grow"/>
                </div>
            </div>
            <div id="top-container" className="flex flex-column vertical-container">
                <div id="description-container" className="flex flex-column card">
                    <h3>Maker Activity X</h3>
                    <p><b>Instructions / Science Brief: </b>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                        ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
            </div>
            <div id="bottom-container" className="flex vertical-container">
                <div id="blockly-canvas" style={{"height": "800px", "width": "100%"}}/>
                <div id="models-container" className="flex flex-column card space-between">
                    <h3>Activity Models</h3>
                    <img src="assets/arduino.png" id="model-img"/>
                    <div id="model-btn-container" className="flex space-between">
						<span>
							<input type="radio" value="arduino" name="model-btn" />
							<label htmlFor="btn-arduino">Arduino</label>
						</span>
                        <span>
							<input type="radio" value="maker" name="model-btn"/>
							<label htmlFor="btn-maker">Maker</label>
						</span>
                        <span>
							<input type="radio" value="science" name="model-btn"/>
							<label htmlFor="btn-science">Science</label>
						</span>
                    </div>
                </div>
            </div>
        </div>

        {/* This xml is for the blocks' menu we will provide. Here are examples on how to include categories and subcategories */}
        <xml id="toolbox" style={{"display": "none"}}>
            <category name="Conditionals">
                <category name="Operations">
                    <block type="controls_if"/>
                    <block type="logic_compare"/>
                    <block type="controls_whileUntil"/>
                </category>
            </category>
            <category name="Input and Output">
                <category name="Numeric">
                    <block type="math_number"/>
                    <block type="math_arithmetic"/>
                </category>
                <category name="Text">
                    <block type="text"/>
                    <block type="text_print"/>
                </category>
                <category name="Your Variables" custom="VARIABLE"/>
            </category>
             Here I input Ardublockly category and blocks. Check: ardublockly_toolbox.js
            <category id="catInputOutput" name="Input/Output">
                <block type="io_digitalwrite">
                    <value name="STATE">
                        <block type="io_highlow"/>
                    </value>
                </block>
                <block type="io_digitalread"/>
                <block type="io_builtin_led">
                    <value name="STATE">
                        <block type="io_highlow"/>
                    </value>
                </block>
                <block type="io_analogwrite"/>
                <block type="io_analogread"/>
                <block type="io_highlow"/>
                <block type="io_pulsein">
                    <value name="PULSETYPE">
                        <shadow type="io_highlow"/>
                    </value>
                </block>
                <block type="io_pulsetimeout">
                    <value name="PULSETYPE">
                        <shadow type="io_highlow"/>
                    </value>
                    <value name="TIMEOUT">
                        <shadow type="math_number">
                            <field name="NUM">100</field>
                        </shadow>
                    </value>
                </block>
            </category>
        </xml>
        </div>
);

}

export default App;