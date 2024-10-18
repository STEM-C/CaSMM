'use strict'

const {sanitizeEntity} = require("strapi-utils/lib")

module.exports = {

    async me(ctx) {

        // get the student that is currently logged in
        const {ids, session} = ctx.state.user
        const students = await strapi.services.student.find({id: ids}, [])

        // return the students and the current session
        return {
            session,
            students: students.map(student => sanitizeEntity(student, {model: strapi.models.student}))
        }
    },
    /**
     * Update student enrolled attribute
     *
     * @param {Boolean} enrolled
     *
     * @return {Student}
     */
    async enrolled(ctx) {

        // ensure request was not sent as formdata
        if (ctx.is('multipart')) return ctx.badRequest(
            'Multipart requests are not accepted!',
            {id: 'Student.enrolled.format.invalid', error: 'ValidationError'}
        )

        // ensure the request has the right number of params
        const params = Object.keys(ctx.request.body).length
        if (params !== 1) return ctx.badRequest(
            'Invalid number of params!',
            {id: 'Student.enrolled.body.invalid', error: 'ValidationError'}
        )

        // validate the request
        const {enrolled} = ctx.request.body
        if (typeof enrolled !== "boolean") return ctx.badRequest(
            'An enrollment status must be provided!',
            {id: 'Student.enrolled.body.invalid', error: 'ValidationError'}
        )

        // find student
        const {id} = ctx.params
        let student = await strapi.services.student.findOne({id: id})
        if (!student) return ctx.notFound(
            'The student id provided does not correspond to a valid student!',
            {id: 'Student.enrolled.id.invalid', error: 'ValidationError'}
        )


        // remove private fields and return the new student
        student.enrolled = ctx.request.body.enrolled
        const updatedStudent = await strapi.services.student.update({id: id}, student)
        return sanitizeEntity(updatedStudent, {model: strapi.models.student})
    },

    async create(ctx) {
        const {students, classroom} = ctx.request.body

        if (students) {
            return await Promise.all(students.map(student => {
                // validate the request
                if (typeof student.name !== "string" || !student.name) return ctx.badRequest(
                    'A name must be provided!',
                    {id: 'Student.create.body.invalid', error: 'ValidationError'}
                )

                return strapi.services.student.create({
                    name: student.name,
                    character: student.character,
                    classroom: classroom
                })
            }))
        }

        // validate the request
        const {name} = ctx.request.body
        if (typeof name !== "string" || !name) return ctx.badRequest(
            'A name must be provided!',
            {id: 'Student.create.body.invalid', error: 'ValidationError'}
        )

        return strapi.services.student.create(ctx.request.body)
    }
}
