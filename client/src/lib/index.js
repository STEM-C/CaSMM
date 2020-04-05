var workspace = Blockly.inject('blockly-canvas', {toolbox: document.getElementById('toolbox')});

function getJS() {
    // Generates Arduino code to display it.
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var code = Blockly.JavaScript.workspaceToCode(workspace);
    return code;
}

function getArduino() {
    // Generates Arduino code to display it.
    Blockly.Arduino.INFINITE_LOOP_TRAP = null;
    var code = Blockly.Arduino.workspaceToCode(workspace);
    return code;
}

function compileArduinoCode() {
    body = {
        "board": "arduino:avr:uno",
        "sketch": getArduino()
    };

    // gets compiled hex from server
    let Hex;
    $.post("http://174.138.32.52:3000/compile", body, (data) => {
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

$(document).ready(function() {
    $('input[type=radio][name=model-btn]').change(function() {
        document.getElementById('model-img').src = `./assets/${this.value}.png`
    });
})