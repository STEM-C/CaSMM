'use strict'

const progressStatusMap = {
    0: 'WAITING',
    50: 'COMPILING',
    100: 'COMPLETED'
}

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

module.exports.completeJob = (jobId, result) => {
    console.log(`${jobId}, ${result}`)
}
