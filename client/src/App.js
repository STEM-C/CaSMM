import React, {useState, useRef} from "react";
import "./App.css";
import {getArduino, getJS, compileArduinoCode} from "./scripts";

function App() {
    const [board, updateBoard] = useState("uno");

    const alertArduino = () => {
        alert(getArduino());
    };

    const alertJS = () => {
        alert(getJS());
    };

    const alertCompile = () => {
        alert(compileArduinoCode());
    };

    return (
        <body>
        <div id="container" className="flex flex-column">
            <div id="nav-container" className="flex vertical-container space-between">
                <h1 id="title">STEM+C</h1>
                <div id="action-btn-container" className="flex space-between">
                    {/*<i onClick={alertJS} onMouseOver="this.style.cursor='hand'" className={"fab fa-js hvr-grow"}/>*/}
                    {/*<i onClick={alertArduino} onMouseOver="this.style.cursor='hand'" className="hvr-grow">A</i>*/}
                    {/*<i onClick={alertCompile} onMouseOver="this.style.cursor='hand'" className="fas fa-play hvr-grow"/>*/}
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
							<input type="radio" value="arduino" name="model-btn" checked/>
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
        {/*<xml id="toolbox" style="display: none">
             Here I input Blockly category and blocks
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
        </xml>*/}
        </body>
);

}

export default App;