import {compileCode} from "../../Utils/requests";
import {message} from "antd";

const AvrboyArduino = window.AvrgirlArduino;

export const setLocalActivity = (workspaceRef, activityType) => {
    let workspaceDom = window.Blockly.Xml.workspaceToDom(workspaceRef)
    let workspaceText = window.Blockly.Xml.domToText(workspaceDom)
    const localActivity = JSON.parse(localStorage.getItem(activityType))

    let lastActivity = {...localActivity, template: workspaceText}
    localStorage.setItem(activityType, JSON.stringify(lastActivity))
}

// Generates xml from blockly canvas
export const getXml = (workspaceRef) => {

    const {Blockly} = window

    let xml = Blockly.Xml.workspaceToDom(workspaceRef)
    let xml_text = Blockly.Xml.domToText(xml)
    alert(xml_text)
    return (xml_text)
};

// Generates javascript code from blockly canvas
export const getJS = (workspaceRef) => {
    window.Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    let code = window.Blockly.JavaScript.workspaceToCode(workspaceRef);
    alert(code);
    return (code);
};

// Generates Arduino code from blockly canvas
export const getArduino = (workspaceRef, shouldAlert = true) => {
    window.Blockly.Arduino.INFINITE_LOOP_TRAP = null;
    let code = window.Blockly.Arduino.workspaceToCode(workspaceRef);
    if (shouldAlert) alert(code);
    return (code);
};

// Sends compiled arduino code to server and returns hex to flash board with
export const compileArduinoCode = async (workspaceRef) => {
    let body = {
        "board": "arduino:avr:uno",
        "sketch": getArduino(workspaceRef, false)
    };

    // gets compiled hex from server
    let response = await compileCode(body);

    if (response.data) {
        // converting base 64 to hex
        let Hex = atob(response.data.hex).toString();

        const avrgirl = new AvrboyArduino({
            board: "uno",
            debug: true
        });

        avrgirl.flash(Hex, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('done correctly.');
            }
        })
    } else {
        message.error(response.err);
    }
};