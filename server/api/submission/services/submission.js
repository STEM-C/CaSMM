'use strict'

const Queue = require('bull')

const progressStatusMap = {
    0: 'WAITING',
    50: 'COMPILING',
    100: 'COMPLETED'
}

// connect/create the submissions queue, attach listeners, and set global listeners
module.exports.initCompileQueue = () => {

    // get queue url
    const url = strapi.config.get('compile_queue.url')

    // connect to queue
    const compile_queue = new Queue('submissions', url);

    // add the submission progress listener
    compile_queue.on('global:progress', strapi.services.submission.updateProgress)
      
    // add the submission complete listener 
    compile_queue.on('global:complete', strapi.services.submission.completeJob)

    // add queue globally
    strapi.connections.compile_queue = compile_queue
} 

// listener function for queue progress updates
module.exports.updateProgress = async (jobId, progress) => {

    // get the submission_id from the job
    const job = await strapi.connections.compile_queue.getJob(jobId)

    // construct the update object
    let updates = { status: progressStatusMap[progress] }
    if (progress == 0) updates.job_id = jobId

    // update the submission
    await strapi.services.submission.update({ id: job.data.submission_id }, updates)

    console.log(`Compile job ${jobId} is ${updates.status}`)
}

// listener function for queue completed jobs
module.exports.completeJob = (jobId, result) => {
    console.log(`${jobId}, ${result}`)
}