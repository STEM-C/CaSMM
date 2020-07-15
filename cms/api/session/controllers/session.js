'use strict'

const { sanitizeEntity } = require('strapi-utils')

module.exports = {

    /**
     * Get a list of session activities
     * for the current student user
     * 
     * @param {Integer} studentId
     * @param {String} code
     * 
     * @return {Activities}
     */
    async getStudentActivities(ctx) {

        // get the activities from the 
        // students current session
        const { session } = ctx.state.user
        const { activities } = await strapi.services.session.findOne({ id: session })

        // remove private fields and return the session's activities
        return activities.map(activity => sanitizeEntity(activity, {
            model: strapi.models.activity
        }))
    },

    /**
     * Get a list of students, with a valid session code, 
     * that belong to the session's classroom
     *
     * @return {Array<Student>}
     */
    async findByCode(ctx) {

        const { code } = ctx.params
        const { session } = await strapi.services.session.findByCode(code)

        // check if the session exists
        let response
        if (session) {
            // get the students belonging to the session's classroom
            const students = await strapi.services.student.find({ classroom: session.classroom.id })
            response = students.map(student => { return { 
                id: student.id, 
                name: student.name,
                character: student.character
            }})
        }

        return response
    },

    /**
     * Create a new session with a unqiue active code
     * 
     * @param {String} name
     * @param {String} description
     * @param {Array<Integer>} activities
     * @param {Integer} classroom
     *
     * @return {Session} 
     */
    async create(ctx) {

        // ensure request was not sent as formdata
        if (ctx.is('multipart')) return ctx.badRequest(
            'Multipart requests are not accepted!',
            { id: 'Session.create.format.invalid', error: 'ValidationError' }
        )

        // validate the request
        const { classroom, activities } = ctx.request.body
        if (!classroom, !strapi.services.validator.isIntArray(activities)) return ctx.badRequest(
            'A classroom and at least one activity must be provided!',
            { id: 'Session.create.body.invalid', error: 'ValidationError' }
        )

        // ensure the activities are valid
        const validActivities = await strapi.services.activity.find({ id: activities })
        if (validActivities.length !== activities.length) return ctx.notFound(
            'One or more of the activities are invalid!',
            { id: 'Session.create.activities.invalid', error: 'ValidationError' }
        )

        // add a unique code to the request body
        ctx.request.body.code = await strapi.services.session.getUniqueCode()

        // remove private fields and return the new session
        const session = await strapi.services.session.create(ctx.request.body)
        return sanitizeEntity(session, { model: strapi.models.session })
    },

    /**
     * Log new or existing students into a session
     * 
     * @param {Integer} students
     * @param {String} code
     * 
     * @return {JWT, Students}
     */
    async join(ctx) {

        const { students, code } = ctx.request.body

        // validate the request
        if(!code || !strapi.services.validator.isIntArray(students)) return ctx.badRequest(
            'Must provide a code and at least one integer studentId!',
            { id: 'Session.join.body.invalid', error: 'ValidationError'}
        )

        // ensure the code corresponds to an active session
        const { model: sessionModel, session } = await strapi.services.session.findByCode(code)
        if (!session || !session.active) return ctx.notFound(
            'The code provided does not correspond to a valid session!',
            { id: 'Session.join.code.invalid', error: 'ValidationError' }
        )

        // ensure the students are exist
        let validStudents = await strapi.services.student.find({ id: students })
        if (validStudents.length !== students.length) return ctx.notFound(
            'One or more of the students are invalid!',
            { id: 'Session.join.students.invalid', error: 'ValidationError' }
        )

        // ensure all the students belong to the classroom
        let newStudents = []
        validStudents.forEach(student => {
            // first check classroom status
            if (!student.classroom || student.classroom.id !== session.classroom.id) return ctx.notFound(
                'One or more of the students do not belong to the classroom!',
                { id: 'Session.join.studentId.invalid', error: 'ValidationError' }
            )

            // mark the students that are new to the session
            if (session.students.find(existingStudent => 
                existingStudent.id === student.id) === undefined) 
                newStudents.push(student.id)
        })

        // add the new students to the session
        if (newStudents.length) await sessionModel.students().attach(newStudents)

        // return a jwt for future requests and the students
        return {
            jwt: strapi.plugins['users-permissions'].services.jwt.issue({
                ids: students,
                session: session.id,
                isStudent: true
            }),
            students: validStudents.map(student => {
                const { id, name, character } = student
                return { id, name, character }
            })
        }
        // this bypasses the local authentication and requires custom
        // handling of the resulting token in the permissions policy
    },

    /**
     * Update a session
     *
     * @param {Session}
     * 
     * @return {Session}
     */
    async update(ctx) {

        // ensure request was not sent as formdata
        if (ctx.is('multipart')) return ctx.badRequest(
            'Multipart requests are not accepted!',
            { id: 'Session.create.format.invalid', error: 'ValidationError' }
        )

        // ensure the update is not to the code, classroom, or students
        const { code, classroom, students } = ctx.request.body
        if (code || classroom || students) return ctx.badRequest(
            'A session\'s code, classroom, and students can not be updated!',
            { id: 'Session.update.body.invalid', error: 'ValidationError' }
        )

        const { id } = ctx.params
        const { active } = ctx.request.body

        // when reactivating a session, get a new code
        // in case the original one was issued
        if (active && active === true) ctx.request.body.code = await strapi.services.session.getUniqueCode()

        // update the session
        // remove private fields and return the updated session
        let session = await strapi.services.session.update({ id }, ctx.request.body)
        return sanitizeEntity(session, { model: strapi.models.session })
    },
}

