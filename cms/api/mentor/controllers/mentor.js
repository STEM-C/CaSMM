'use strict'

const { sanitizeEntity } = require("strapi-utils/lib")

module.exports = {

    async me(ctx) {

        // get the mentor that is currently logged in
        const { user } = ctx.state
        const mentor = await strapi.services.mentor.findOne({ user: user.id })

        // remove private fields and return the mentor
        return sanitizeEntity(mentor, { model: strapi.models.mentor })
    },

    /**
     * Create a new mentor
     * 
     * @param {String} first_name
     * @param {String} last_name
     *
     * @return {Mentor} 
     */
    async create(ctx) {

        // ensure the request is in the right format
        if (ctx.is('multipart')) return ctx.badRequest(
            'Multipart requests are not accepted!',
            { id: 'Mentor.create.format.invalid', error: 'ValidationError' }
        )

        // get the user that is currently logged in
        // to set as the new mentor's user
        const { user } = ctx.state
        ctx.request.body.user = user.id
        
        // remove private fields and return the new mentor
        const mentor = await strapi.services.mentor.create(ctx.request.body)
        return sanitizeEntity(mentor, { model: strapi.models.mentor })
    }
}