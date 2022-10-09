"use strict"

const Queue = require("bull")
const redisUrlParse = require("redis-url-parse")
const progressStatusMap = {
  0: "CREATED", // never set - just for reference
  50: "COMPILING",
  100: "COMPLETED",
}

// connect/create the submissions queue, attach listeners, and set global listeners
module.exports.initCompileQueue = () => {
  try {
    // get queue url
    const url = strapi.config.get("compile_queue.url")
    const { host, port, password } = redisUrlParse(url)
    const bullOptions = url.includes("rediss://")
      ? {
          redis: {
            port: Number(port),
            host,
            password,
            tls: {
              rejectUnauthorized: false,
              requestCert: true,
            },
          },
        }
      : url
    // connect to queue
    const compile_queue = new Queue("submissions", bullOptions)

    // add the submission progress listener
    compile_queue.on(
      "global:progress",
      strapi.services.submission.updateProgress
    )

    // add the submission complete listener
    compile_queue.on("global:completed", strapi.services.submission.completeJob)

    // add queue globally
    strapi.connections.compile_queue = compile_queue
  } catch (err) {
    console.error("err init queue", err)
  }
}

// listener function for queue progress updates
module.exports.updateProgress = async (jobId, progress) => {
  try {
    const status = progressStatusMap[progress]

    // let completeJob handle last progress
    if (progress == 100) return

    // get the submission_id from the job
    const { data } = await strapi.connections.compile_queue.getJob(jobId)

    // update the submission
    await strapi.services.submission.update(
      { id: data.submissionId },
      { status }
    )
  } catch (err) {
    console.error(`err updating job ${jobId} progress`, err)
  }
  5
}

// listener function for queue completed jobs
module.exports.completeJob = async (jobId, result) => {
  try {
    // get the submission_id from the job
    const { data } = await strapi.connections.compile_queue.getJob(jobId)

    // parse the results
    const updates = JSON.parse(result)
    updates.status = "COMPLETED"

    // update the submission
    await strapi.services.submission.update({ id: data.submissionId }, updates)
  } catch (err) {
    console.error(`err completing job ${jobId}`, err)
  }
}

// create a submission entry and add a job to the queue
module.exports.startJob = async config => {
  // create the submission
  const {
    board,
    sketch,
    id: submissionId,
  } = await strapi.services.submission.create({
    ...config,
    status: "CREATED",
  })

  // add the submission to the queue
  const { id: job_id } = await strapi.connections.compile_queue.add({
    board,
    sketch,
    submissionId,
  })

  // add the job_id to the submission
  const submission = await strapi.services.submission.update(
    { id: submissionId },
    { job_id }
  )

  // return the new submission
  return submission
}
