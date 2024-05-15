'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const { sanitizeEntity } = require('strapi-utils/lib');


module.exports = {
  async arduinoUpdate(ctx) {
    const {id} = ctx.params;
    const {arduino} = ctx.request.body;
    const session = await strapi.services.session.findOne({ id });
    //console.log(session)
    //console.log(arduino)
    session.arduino = arduino;
    const updatedSession = await strapi.services.session.update({id}, session);
    return updatedSession

  },  
  async arduinoMultiUpdate(ctx) {
    const {id} = ctx.params;
    const {arduino} = ctx.request.body;
    const session = await strapi.services.session.findOne({ id });
    session.multi_arduino = arduino;
    const updatedSession = await strapi.services.session.update({id}, session )
    return updatedSession;
  },
  async findOne(ctx) {
    // Extract the ID from the request parameters
    const { id } = ctx.params;
    // Implement custom logic to fetch a single record by ID
    const session = await strapi.services.session.findOne({ id });
    // Customize the response as needed
    ctx.send(session);
  },
};
