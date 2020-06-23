'use strict'

const { parseMultipartData, sanitizeEntity } = require('strapi-utils')

const getRandomCode = () => {

    let now = Date.now().toString()
    let len = now.length
    return now.substr(len - 4, len)
}

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
     * @param {Integer} classroom – id of the classroom
     * @param {Integer} studentId – id of an existing student
     * @param {String} name - name of a new student
     * @param {String} character - character of a new student
     * 
     * @return {Object}
     */
    async join(ctx) {

        const { classroom, studentId, name, character } = ctx.request.body

        let student

        if (!studentId) {

            student = await strapi.services.student.create({ name, character, classroom })
        } else {

            student = await strapi.services.student.find({ id: studentId })
        }

        return sanitizeEntity(student, { model: strapi.models.student })
    }
}

