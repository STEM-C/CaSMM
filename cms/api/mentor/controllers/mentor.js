'use strict'

const { sanitizeEntity } = require("strapi-utils/lib")

module.exports = {

    async me(ctx) {

        // get the mentor that is currently logged in
        const { user } = ctx.state
        const mentor = await strapi.services.mentor.findOne({ user: user.id })

        // remove private fields and return the mentor
        return sanitizeEntity(mentor, { model: strapi.models.mentor })
    }
}