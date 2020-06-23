'use strict'

const { parseMultipartData, sanitizeEntity } = require('strapi-utils')

const getRandomCode = () => {

    let now = Date.now().toString()
    let len = now.length
    return now.substr(len - 4, len)
}

const formatError = error => [
    { messages: [{ id: error.id, message: error.message, field: error.field }] },
]

module.exports = {

    /**
     * Create a new session with a unqiue active code
     *
     * @return {Object}
     */
    async create(ctx) {

        let entity

        if (ctx.is('multipart')) {

            const { data, files } = parseMultipartData(ctx)
            entity = await strapi.services.session.create(data, { files })
        } else {

            let code, exists

            do {
                code = getRandomCode()
                let matches = await strapi.services.session.find({ code, active: true })
                exists = matches.length > 0
            }
            while (exists)

            ctx.request.body.code = code
            entity = await strapi.services.session.create(ctx.request.body)
        }

        return sanitizeEntity(entity, { model: strapi.models.session })
    },

    /**
     * Retrieve a session by code
     *
     * @return {Object}
     */
    async findOne(ctx) {

        const { code } = ctx.params;

        const entity = await strapi.services.session.findOne({ code })
        return sanitizeEntity(entity, { model: strapi.models.session })
    },

    /**
     * Returns the student
     * 
     * @param {Integer} studentId – id of an existing student
     * @param {String} name - name of a new student
     * @param {String} character - character of a new student
     * @param {Integer} classroom – id of the classroom of a new student
     * 
     * @return {Object}
     */
    async join(ctx) {

        const { studentId, name, character, classroom } = ctx.request.body

        // Check that either a studentId was sent or
        // a name, character, and classroom was sent
        if (!(studentId || (name && character && classroom))) {
            return ctx.badRequest(
                null,
                formatError({
                  id: 'Session.join.body.invalid',
                  message: 'Must provide either a studentId or a name, character, and classroom!',
                })
            )
        }

        let student
        if (!studentId) {
            student = await strapi.services.student.create({ name, character, classroom })
        } else {
            student = await strapi.services.student.findOne({ id: studentId })
            if (!student) return ctx.badRequest(
                null,
                formatError({
                  id: 'Session.join.student.id.invalid',
                  message: 'The id provided does not correspond to a valid student!',
                })
            )
        }

        return {
            jwt: strapi.plugins['users-permissions'].services.jwt.issue({
                id: 1, // Use a deignated student user for roles and permissions
                studentId: student.id
            }),
            student: sanitizeEntity(student, { 
                model: strapi.models.student 
            })
        }
    }
}

