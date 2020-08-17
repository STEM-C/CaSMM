const throng = require('throng')
const Queue = require("bull")

const arduino_dir = __dirname + "/arduino-1.8.5"
const arduino = new (require("./arduino.js"))(arduino_dir)

// Connect to a local redis instance locally, and the Heroku-provided URL in production
let REDIS_URL = process.env.REDIS_URL || "redis://compile_queue:6379"

// Spin up multiple processes to handle jobs to take advantage of more CPU cores
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
let workers = process.env.WEB_CONCURRENCY || 1

// The maximum number of jobs each worker should process at once. This will need
// to be tuned for your application. If each job is mostly waiting on network 
// responses it can be much higher. If each job is CPU-intensive, it might need
// to be much lower.
let maxJobsPerWorker = process.env.COMPILE_JOB_CONCURRENCY || 1

function start() {

    // Connect to the named queue
    let compile_queue = new Queue('submissions', REDIS_URL)

    compile_queue.process(maxJobsPerWorker, async (job) => {

        // update the job progress
        await job.progress(50)

        // get the job data
        const { sketch, board } = job.data

        let result = {}
        try {
            result = await arduino.compile(sketch, board)
        } catch(err) {
            // set the output object to failed
            output.sucess = false
            output.stderr = err.messsage

            console.err('Compile Error', err)
        }

        // update the job progress and return the job result
        await job.progress(100)
        return result
    })
}

// Initialize the clustered worker process
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
throng({ workers, start })