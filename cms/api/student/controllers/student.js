'use strict'

const { sanitizeEntity } = require("strapi-utils/lib")

module.exports = {

    async me(ctx) {

        // get the student that is currently logged in
        const { user } = ctx.state
        const student = {
            ...user,
            ...await strapi.services.student.findOne({ id: user.id })
        }

        // remove private fields and return the new activities
        return sanitizeEntity(student, { model: strapi.models.student })
    }
}
