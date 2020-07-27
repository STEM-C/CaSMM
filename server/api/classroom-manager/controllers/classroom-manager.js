'use strict'

const { sanitizeEntity } = require("strapi-utils/lib")

module.exports = {

    /**
     * Get the currrent classroom manager that is logged in
     *
     * @return {Mentor || Teacher}
     */
    async me(ctx) {

        const { id } = ctx.state.user

        // get the classroom manager
        const { classroomManager, type } = await strapi.services['classroom-manager'].findById(id)

        // remove private fields and return the classroom manager
        return type === 'mentor' ? 
            sanitizeEntity(classroomManager, { model: strapi.models.mentor }) : 
            sanitizeEntity(classroomManager, { model: strapi.models.teacher })
    }
}