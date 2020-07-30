'use strict'

module.exports = {

    /**
     * Get the current student(s) saves for a day
     * 
     * @param {*} ctx 
     */
    async findByDay(ctx) {

        const { ids } = ctx.state.user
        const { day } = ctx.params
        console.log(ids, day)

        const saves = await strapi.services.save.find({ student: ids, day })
        return saves
    },

    async create(ctx) {

        // ensure request was not sent as formdata
        if (ctx.is('multipart')) return ctx.badRequest(
            'Multipart requests are not accepted!',
            { id: 'Save.create.format.invalid', error: 'ValidationError' }
        )

        // ensure the request has the right number of params
        const params = Object.keys(ctx.request.body).length
        if (params !== 2) return ctx.badRequest(
            'Invalid number of params!',
            { id: 'Save.create.body.invalid', error: 'ValidationError' }
        )

        // validate the request
        const { day, workspace } = ctx.request.body
        if (!strapi.services.validator.isInt(day) || !workspace) return ctx.badRequest(
            'A day and workspace must be provided!',
            { id: 'Save.create.body.invalid', error: 'ValidationError' }
        )

        // ensure the day is valid
        const validDay = await strapi.services.day.findOne({ id: day })
        if (validDay === null) return ctx.notFound(
            'The day provided is invalid!',
            { id: 'Save.create.day.invalid', error: 'ValidationError' }
        )
    }
}
