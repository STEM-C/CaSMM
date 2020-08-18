'use strict' 

module.exports = {

    /**
     * 
     * Get a submission in the current session
     * 
     * @param {Integer} id 
     * 
     * @return {Submission}
     */
    async findOne(ctx) {

        // get the submission id and current session
        let { id } = ctx.params
        const { session } = ctx.state.user

        // make sure the id
        // is in the proper format
        id = parseInt(id)

        // ensure the id is an int
        if (!strapi.services.validator.isInt(id)) return ctx.badRequest(
            'The submission id must be an int!',
            { id: 'Submission.find.id.invalid', error: 'ValidationError' }
        )

        // ensure the submission exists and belongs to the current session
        const submission = await strapi.services.submission.findOne({ id })
        if (!submission || submission.session.id != session) return ctx.notFound(
            'The submission id provided is invalid!',
            { id: 'Submission.find.id.notfound', error: 'ValidationError' }
        )

        // only return the full submission object with it is complete
        return submission.status == 'COMPLETED' ? submission : { status: submission.status } 
    },

    /**
     * 
     * Create a submission entry and a compile job to the queue
     * 
     * @param {String} board
     * @param {String} sketch
     * @param {Integer} day
     * @param {String} workspace 
     * 
     * @return {Submission}
     */
    async create(ctx) {

        // ensure request was not sent as formdata
        if (ctx.is('multipart')) return ctx.badRequest(
            'Multipart requests are not accepted!',
            { id: 'Submission.create.format.invalid', error: 'ValidationError' }
        )

        // ensure the request has the right number of params
        const params = Object.keys(ctx.request.body).length
        if (params !== 4) return ctx.badRequest(
            'Invalid number of params!',
            { id: 'Submission.create.body.invalid', error: 'ValidationError' }
        )

        // validate the request
        const { day: dayId, workspace, board, sketch } = ctx.request.body
        if (!strapi.services.validator.isInt(dayId) && board && sketch ) return ctx.badRequest(
            'A day, workspace, board, and sketch must be provided!',
            { id: 'Submission.create.body.invalid', error: 'ValidationError' }
        )

        // ensure the day is valid
        const day = await strapi.services.day.findOne({ id: dayId })
        if (!day) return ctx.notFound(
            'The day provided is invalid!',
            { id: 'Submission.create.day.invalid', error: 'ValidationError' }
        )

        // get the current session
        const { session } = ctx.state.user

        // create the submission
        let submission = await strapi.services.submission.create({ 
            day: dayId, 
            status: 'CREATED', 
            session,
            workspace,
            board,
            sketch
        })

        // add the submission to the queue
        const job = await strapi.connections.compile_queue.add({
            board,
            sketch,
            submission_id: submission.id
        })

        // add the job_id to the submission
        submission = await strapi.services.submission.update({ id: submission.id }, { job_id: job.id }) 

        // return the new submission
        return submission
    },
}
