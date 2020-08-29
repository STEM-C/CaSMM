'use strict'

module.exports = {

    async toolbox() {

        // get the blocks 
        const blocks = await strapi.services.block.find()
    
        // return the activity id and the toolbox
        return { toolbox: strapi.services.block.blocksToToolbox(blocks) }
    },

    /**
     * 
     * Get a sandbox submission
     * 
     * @param {Integer} id 
     * 
     * @return {Submission}
     */
    async findOneSubmission(ctx) {

        // get the submission id 
        let { id } = ctx.params

        // make sure the id
        // is in the proper format
        id = parseInt(id)

        // ensure the id is an int
        if (!strapi.services.validator.isInt(id)) return ctx.badRequest(
            'The submission id must be an int!',
            { id: 'Sandbox.submission.find.id.invalid', error: 'ValidationError' }
        )

        // ensure the submission exists and is a sandbox
        const submission = await strapi.services.submission.findOne({ id, sandbox: true })
        if (!submission) return ctx.notFound(
            'The submission id provided is invalid!',
            { id: 'Sandbox.submission.find.id.notfound', error: 'ValidationError' }
        )

        // only return the full submission object with it is complete
        return submission.status == 'COMPLETED' ? submission : { status: submission.status } 
    },

    /**
     * 
     * Create a submission entry and add compile job to the queue
     * 
     * @param {String} board
     * @param {String} sketch
     * @param {Integer} day
     * @param {String} workspace 
     * 
     * @return {Submission}
     */
    async createSubmission(ctx) {

        // ensure request was not sent as formdata
        if (ctx.is('multipart')) return ctx.badRequest(
            'Multipart requests are not accepted!',
            { id: 'Sandbox.submission.create.format.invalid', error: 'ValidationError' }
        )

        // ensure the request has the right number of params
        const params = Object.keys(ctx.request.body).length
        if (params !== 3) return ctx.badRequest(
            'Invalid number of params!',
            { id: 'Sandbox.submission.create.body.invalid', error: 'ValidationError' }
        )

        // validate the request
        const { workspace, board, sketch } = ctx.request.body
        if (!workspace || !board || !sketch ) return ctx.badRequest(
            'A workspace, board, and sketch must be provided!',
            { id: 'Sandbox.submission.create.body.invalid', error: 'ValidationError' }
        )

        // construct submission
        return await strapi.services.submission.startJob({
            sandbox: true,
            workspace,
            board,
            sketch
        })
    },
}