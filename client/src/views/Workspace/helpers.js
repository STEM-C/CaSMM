import { compileCode } from "../../dataaccess/requests";

const AvrboyArduino = window.AvrgirlArduino;

// Generates javascript code from blockly canvas
export const getJS = (workspaceRef) => {
    window.Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    let code = window.Blockly.JavaScript.workspaceToCode(workspaceRef);
    alert(code);
    return (code);
};

// Generates Arduino code from blockly canvas
export const getArduino = (workspaceRef) => {
    window.Blockly.Arduino.INFINITE_LOOP_TRAP = null;
    let code = window.Blockly.Arduino.workspaceToCode(workspaceRef);
    alert(code);
    return (code);
};

// Sends compiled arduino code to server and returns hex to flash board with
export const compileArduinoCode = async (workspaceRef) => {
    let body = {
        "board": "arduino:avr:uno",
        "sketch": getArduino(workspaceRef)
    };

    // gets compiled hex from server
    let response = await compileCode(body)

    // converting base 64 to hex
    let Hex = atob(response.hex).toString();

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
};