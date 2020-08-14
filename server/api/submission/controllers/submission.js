'use strict' 

module.exports = {

    /**
     * 
     * @param {*} ctx 
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
            'A day, board, and sketch must be provided!',
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
        const submission = await strapi.services.submission.create({ 
            day: dayId, 
            status: 'CREATED', 
            session,
            workspace,
            board,
            sketch
        })

        // add the submission to the queue

        // return the new submission
        return submission
    },
}
