'use strict';

const { sanitizeEntity } = require('strapi-utils/lib');

module.exports = {
  /**
   * Get the currrent classroom manager that is logged in
   *
   * @return {Mentor}
   */
  async me(ctx) {
    const { id } = ctx.state.user;

    // get the classroom manager
    const { classroomManager } = await strapi.services[
      'classroom-manager'
    ].findById(id);

    // remove private fields and return the classroom manager
    return sanitizeEntity(classroomManager, { model: strapi.models.mentor });
  },
};
