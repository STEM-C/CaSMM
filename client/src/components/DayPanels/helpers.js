import { createSubmission, getSubmission, saveWorkspace, updateDay } from "../../Utils/requests";
import {message} from "antd";

const AvrboyArduino = window.AvrgirlArduino;

export const setLocalSandbox = (workspaceRef) => {
    let workspaceDom = window.Blockly.Xml.workspaceToDom(workspaceRef)
    let workspaceText = window.Blockly.Xml.domToText(workspaceDom)
    const localActivity = JSON.parse(localStorage.getItem('sandbox-day'))

    let lastActivity = {...localActivity, template: workspaceText}
    localStorage.setItem('sandbox-day', JSON.stringify(lastActivity))
}

// Generates xml from blockly canvas
export const getXml = (workspaceRef, shouldAlert = true) => {

    const {Blockly} = window

    let xml = Blockly.Xml.workspaceToDom(workspaceRef)
    let xml_text = Blockly.Xml.domToText(xml)
    if(shouldAlert) alert(xml_text)
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
export const compileArduinoCode = async (workspaceRef, setSelectedCompile, day, isStudent) => {
    setSelectedCompile(true);
    const sketch = getArduino(workspaceRef, false);
    let workspaceDom = window.Blockly.Xml.workspaceToDom(workspaceRef);
    let workspaceText = window.Blockly.Xml.domToText(workspaceDom);
    let path;
    isStudent ? path = "/submissions" : path = "/sandbox/submission";

    try {
        // create an initial submission
        const initialSubmission = await createSubmission(day, workspaceText, sketch, path, isStudent);

        // get the submission result when it's ready and flash the board
        await getAndFlashSubmission(initialSubmission.data.id, path, isStudent, setSelectedCompile)
    } catch (e) {
        console.log(e.message)
    }
};

const getAndFlashSubmission = async (id, path, isStudent, setSelectedCompile) => {
    // get the submission
    const response = await getSubmission(id, path, isStudent)

    // if the submission is not complete, try again later
    if (response.data.status !== "COMPLETED") {
        setTimeout(() => getAndFlashSubmission(id, path, isStudent, setSelectedCompile), 250)
        return
    }
    setSelectedCompile(false)
    // flash the board with the output
    await flashArduino(response);
}

const flashArduino = async (response) => {
    if (response.data) {
        // converting base 64 to hex
        if(response.data.success){
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
        } else if (response.data.msg) {
            message.warning(response.data.stderr)
        }
    } else {
        message.error(response.err);
    }
}

// save current workspace
export const handleSave = async (dayId, workspaceRef) => {
    let xml = window.Blockly.Xml.workspaceToDom(workspaceRef.current);
    let xml_text = window.Blockly.Xml.domToText(xml);
    return await saveWorkspace(dayId, xml_text);
};

export const handleCreatorSaveDay = async (dayId, workspaceRef) => {
    let xml = window.Blockly.Xml.workspaceToDom(workspaceRef.current);
    let xml_text = window.Blockly.Xml.domToText(xml);
    return await updateDay(dayId, xml_text);
}