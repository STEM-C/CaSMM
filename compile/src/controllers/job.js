const path = require('path');
const arduino_dir = path.resolve(__dirname, '../arduino-1.8.5');
const arduino = new (require('../models/arduino.js'))(arduino_dir);
const { compileLog } = require('../utils/base');

module.exports.processJob = async (job) => {
  // get the job data
  const { sketch, board, submissionId } = job.data;

  // create an identified
  const identifier = `job ${job.id}, submission ${submissionId}`;

  // update the job progress
  await job.progress(50);
  compileLog(`Compiling ${identifier}`);

  let result = {};
  try {
    result = await arduino.compile(sketch, board);
  } catch (err) {
    // set the result object to failed
    result.success = false;
    result.stderr = err.message;

    compileLog(`Failed to compile ${identifier} - ${err}`);
  }

  // update the job progress
  await job.progress(100);
  compileLog(`Completed ${identifier}`);

  // return the compiled result
  return result;
};
