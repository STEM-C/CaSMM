'use strict'

const { sanitizeEntity } = require("strapi-utils/lib")

module.exports = {

    async me(ctx) {

        // get the student that is currently logged in
        const { ids, session } = ctx.state.user
        const students = await strapi.services.student.find({ id: ids })

        // return the students and the current session
        return {
            session,
            students: students.map(student => sanitizeEntity(student, { model: strapi.models.student }))
        }
    }
}
