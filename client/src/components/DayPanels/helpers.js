import {
  createSubmission,
  getSubmission,
  saveWorkspace,
  updateDay,
} from '../../Utils/requests';
import { message } from 'antd';

const AvrboyArduino = window.AvrgirlArduino;

export const setLocalSandbox = (workspaceRef) => {
  let workspaceDom = window.Blockly.Xml.workspaceToDom(workspaceRef);
  let workspaceText = window.Blockly.Xml.domToText(workspaceDom);
  const localActivity = JSON.parse(localStorage.getItem('sandbox-day'));

  let lastActivity = { ...localActivity, template: workspaceText };
  localStorage.setItem('sandbox-day', JSON.stringify(lastActivity));
};

// Generates xml from blockly canvas
export const getXml = (workspaceRef, shouldAlert = true) => {
  const { Blockly } = window;

  let xml = Blockly.Xml.workspaceToDom(workspaceRef);
  let xml_text = Blockly.Xml.domToText(xml);
  if (shouldAlert) alert(xml_text);
  return xml_text;
};

// Generates javascript code from blockly canvas
export const getJS = (workspaceRef) => {
  window.Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
  let code = window.Blockly.JavaScript.workspaceToCode(workspaceRef);
  alert(code);
  return code;
};

// Generates Arduino code from blockly canvas
export const getArduino = (workspaceRef, shouldAlert = true) => {
  window.Blockly.Arduino.INFINITE_LOOP_TRAP = null;
  let code = window.Blockly.Arduino.workspaceToCode(workspaceRef);
  if (shouldAlert) alert(code);
  return code;
};

let intervalId;

// Sends compiled arduino code to server and returns hex to flash board with
export const compileArduinoCode = async (
  workspaceRef,
  setSelectedCompile,
  setCompileError,
  day,
  isStudent
) => {
  setSelectedCompile(true);
  const sketch = getArduino(workspaceRef, false);
  let workspaceDom = window.Blockly.Xml.workspaceToDom(workspaceRef);
  let workspaceText = window.Blockly.Xml.domToText(workspaceDom);
  let path;
  isStudent ? (path = '/submissions') : (path = '/sandbox/submission');
  day.id = isStudent ? day.id : undefined;

  try {
    // create an initial submission
    const initialSubmission = await createSubmission(
      day,
      workspaceText,
      sketch,
      path,
      isStudent
    );
    // Get the submission Id and send a request to get the submission every
    // 0.25 second until the submission status equal to COMPLETE.
    intervalId = setInterval(
      () =>
        getAndFlashSubmission(
          initialSubmission.data.id,
          path,
          isStudent,
          setSelectedCompile,
          setCompileError
        ),
      250
    );

    // Set a timeout of 20 second. If the submission status fail to update to
    // COMPLETE, show error.
    setTimeout(() => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = undefined;
        setSelectedCompile(false);
        message.error('Compile Fail', 3);
        setCompileError('Compile timeout. Please try it again.');
      }
    }, 20000);
  } catch (e) {
    console.log(e.message);
  }
};

const getAndFlashSubmission = async (
  id,
  path,
  isStudent,
  setSelectedCompile,
  setCompileError
) => {
  // get the submission
  const response = await getSubmission(id, path, isStudent);

  // if the submission is not complete, try again later
  if (response.data.status !== 'COMPLETED') {
    return;
  }

  // If the submission is ready
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = undefined;
  }
  // flash the board with the output
  await flashArduino(response, setSelectedCompile, setCompileError);
};

const flashArduino = async (response, setSelectedCompile, setCompileError) => {
  if (response.data) {
    // if we get a success status from the submission, send it to arduino
    if (response.data.success) {
      // converting base 64 to hex
      let Hex = atob(response.data.hex).toString();

      const avrgirl = new AvrboyArduino({
        board: 'uno',
        debug: true,
      });

      avrgirl.flash(Hex, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('done correctly.');
          message.success('Compile Success', 3);
          setSelectedCompile(false);
        }
      });
    }
    // else if there is error on the Arduino code, show error
    else if (response.data.stderr) {
      message.error('Compile Fail', 3);
      setSelectedCompile(false);
      setCompileError(response.data.stderr);
    }
  } else {
    message.error(response.err);
  }
};

// save current workspace
export const handleSave = async (dayId, workspaceRef) => {
  let xml = window.Blockly.Xml.workspaceToDom(workspaceRef.current);
  let xml_text = window.Blockly.Xml.domToText(xml);
  return await saveWorkspace(dayId, xml_text);
};

export const handleCreatorSaveDay = async (dayId, workspaceRef, blocksList) => {
  let xml = window.Blockly.Xml.workspaceToDom(workspaceRef.current);
  let xml_text = window.Blockly.Xml.domToText(xml);

  console.log('The current blocksList is: ', blocksList);

  return await updateDay(dayId, xml_text, blocksList);
};
