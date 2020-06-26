'use strict'

const { sanitizeEntity } = require('strapi-utils')

const getRandomCode = () => {

    let now = Date.now().toString()
    let len = now.length
    return now.substr(len - 4, len)
}

const formatError = error => [
    { messages: [{ id: error.id, message: error.message, field: error.field }] },
]

const getSessionByCode = (code) => strapi.services.session.findOne({ code })

module.exports = {

    /**
     * Create a new session with a unqiue active code
     *
     * @return {Object}
     */
    async create(ctx) {

        let entity

        if (ctx.is('multipart')) {

            return ctx.badRequest(
                null,
                formatError({
                  id: 'Session.create.format.invalid',
                  message: 'Multipart requests are not accepted!',
                })
            )
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
     * Retrieve a list of students with a valid session code
     *
     * @return {Object}
     */
    async findCode(ctx) {

        const { code } = ctx.params

        let resp = await getSessionByCode(code)

        // if a session is found, return list of students
        if (resp) {
            const students = await strapi.services.student.find({ classroom: resp.classroom.id })
            resp = students.map(student => { return { 
                id: student.id, 
                name: student.name,
                character: student.character
            }})
        }

        return resp
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

        const { studentId, code } = ctx.request.body

        // validate the request
        if (!studentId || !code) return ctx.badRequest(
            null,
            formatError({
              id: 'Session.join.body.invalid',
              message: 'Must provide a studentId and code!',
            })
        )

        // make sure the code is valid 
        // and the session is active
        const session = await getSessionByCode(code)
        if (!session || !session.active) return ctx.badRequest(
            null,
            formatError({
                id: 'Session.join.code.invalid',
                message: 'The code provided does not correspond to a valid session!',
            })
        )

        // first look for the student in the session
        let student = session.students.find(student => student.id === studentId)
        if (!student) {

            // check that the student exists and belongs to the classroom
            student = await strapi.services.student.findOne({ id: studentId })
            if (!student || !student.classroom || student.classroom.id !== session.classroom.id) return ctx.badRequest(
                null,
                formatError({
                    id: 'Session.join.studentId.invalid',
                    message: 'The studentId provided does not correspond to a real student or the student is not in the classroom!',
                })
            )

            // add the student to the session 
            student = await strapi.services.student.update({ id: student.id }, { sessions: [session.id] })
            delete student.sessions
        }

        // fill out the classroom field
        student.classroom = session.classroom

        return {
            jwt: strapi.plugins['users-permissions'].services.jwt.issue({
                id: 1, // Use a deignated student user for roles and permissions
                studentId: student.id,
                sessionId: session.id
            }),
            student: sanitizeEntity(student, { 
                model: strapi.models.student 
            })
        }
    }
}

