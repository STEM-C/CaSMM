import AvrgirlArduino from './avrgirl-arduino';

var workspace = Blockly.inject('blockly-canvas', {toolbox: document.getElementById('toolbox')});

export function getJS() {
    // Generates Arduino code to display it.
    window.Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var code = window.Blockly.JavaScript.workspaceToCode(workspace);
    return code;
}

export function getArduino() {
    // Generates Arduino code to display it.
    window.Blockly.Arduino.INFINITE_LOOP_TRAP = null;
    var code = window.Blockly.Arduino.workspaceToCode(workspace);
    return code;
}

export function compileArduinoCode() {
    let body = {
        "board": "arduino:avr:uno",
        "sketch": getArduino()
    };

    // gets compiled hex from server
    let Hex;
    window.$.post("http://174.138.32.52:3000/compile", body, (data) => {
        // converting base 64 to hex
        Hex = atob(data.hex).toString();
        console.log(Hex);

        let avrgirl = new AvrgirlArduino({
            board: 'uno',
            debug: true
        });

        // TODO: Remove hardcoded file path
        avrgirl.flash('off.cpp.hex', (err) => {
            console.log("Done!");
            if (err) {
                console.log(err);
            } else {
                console.log('done correctly.');
            }
        })

    });

}

window.$(document).ready(function() {
    window.$('input[type=radio][name=model-btn]').change(function() {
        document.getElementById('model-img').src = `./assets/${this.value}.png`
    });
});