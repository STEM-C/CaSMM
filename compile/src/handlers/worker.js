const { processJob } = require('../controllers/job')
const { compileLog } = require('../utils/base')

const Queue = require('bull')

// Connect to a local redis instance locally, and the Heroku-provided URL in production
const REDIS_URL = process.env.REDIS_URL || 'redis://compile_queue:6379'

// The maximum number of jobs each worker should process at once. This will need
// to be tuned for your application. If each job is mostly waiting on network 
// responses it can be much higher. If each job is CPU-intensive, it might need
// to be much lower.
const maxJobsPerWorker = process.env.COMPILE_JOB_CONCURRENCY || 1

module.exports.init = () => {

    // starting up the service
    compileLog('Starting compile cluster')
}

module.exports.start = (id) => {

    // Signal worked started
    compileLog(`Started worker ${ id }`);

    // Connect to the named queue
    const compile_queue = new Queue('submissions', REDIS_URL)

    // start processing jobs from the submission queue
    compile_queue.process(maxJobsPerWorker, processJob)
}