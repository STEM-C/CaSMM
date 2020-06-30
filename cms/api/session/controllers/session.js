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
        const { user } = ctx.state
        const { activities } = await strapi.services.session.findOne({ id: user.sessionId })

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
        let resp = await strapi.services.session.findByCode(code)

        // check if the session exists
        if (resp) {
            // get the students belonging to the session's classroom
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

        // make sure a classroom and at least one activity was provided
        const { activities, classroom } = ctx.request.body
        if ( !activities || !Array.isArray(activities) || activities.length == 0 || !classroom) return ctx.badRequest(
            'A classroom and at least one activity must be provided!',
            { id: 'Session.create.body.invalid', error: 'ValidationError' }
        )

        // make sure the activities are valid
        const invalidActivities = (await Promise.all(activities.map( 
            async activity => strapi.services.activity.findOne({ id: activity })
            ))).filter(activity => activity === null)
        if (invalidActivities.length) return ctx.notFound(
            'The activity ids provided are not valid!',
            { id: 'Session.create.activities.invalid', error: 'ValidationError' }
        )

        // add a unique code to the request body
        ctx.request.body.code = await strapi.services.session.getUniqueCode()

        // remove private fields and return the new session
        const session = await strapi.services.session.create(ctx.request.body)
        return sanitizeEntity(session, { model: strapi.models.session })
    },

    /**
     * Log a new or existing student into a session
     * 
     * @param {Integer} studentId
     * @param {String} code
     * 
     * @return {JWT, Student}
     */
    async join(ctx) {

        const { studentId, code } = ctx.request.body

        // validate the request
        if (!studentId || !code) return ctx.badRequest(
            'Must provide a studentId and code!',
            { id: 'Session.join.body.invalid', error: 'ValidationError'}
        )

        // make sure the code is valid 
        // and the session is active
        const session = await strapi.services.session.findByCode(code)
        if (!session || !session.active) return ctx.notFound(
            'The code provided does not correspond to a valid session!',
            { id: 'Session.join.code.invalid', error: 'ValidationError' }
        )

        // check if the student has joined this session before
        let student = session.students.find(student => student.id === studentId)
        if (!student) {
            // add the student to the session
            // check that the student exists and belongs to the classroom
            student = await strapi.services.student.findOne({ id: studentId })
            if (!student || !student.classroom || student.classroom.id !== session.classroom.id) return ctx.notFound(
                'The studentId provided does not correspond to a real student or the student is not in the classroom!',
                { id: 'Session.join.studentId.invalid', error: 'ValidationError' }
            )

            // add the student to the session 
            student = await strapi.services.student.update({ id: student.id }, { sessions: [session.id] })
            delete student.sessions
        }

        // fill out the classroom field
        student.classroom = session.classroom

        // return a jwt for future requests and the student
        return {
            jwt: strapi.plugins['users-permissions'].services.jwt.issue({
                id: student.id,
                sessionId: session.id,
                isStudent: true
            }),
            student: sanitizeEntity(student, { 
                model: strapi.models.student 
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

