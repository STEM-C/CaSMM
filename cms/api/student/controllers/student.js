'use strict'

const { sanitizeEntity } = require("strapi-utils/lib")

module.exports = {

    async me(ctx) {

        // get the student that is currently logged in
        const { user } = ctx.state
        const student = await strapi.services.student.findOne({ id: user.id })

        // add the students current session
        student.sessionId = user.sessionId

        // remove private fields and return the student
        return sanitizeEntity(student, { model: strapi.models.student })
    }
}
