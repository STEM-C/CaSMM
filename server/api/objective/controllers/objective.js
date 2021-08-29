'use strict';
const { sanitizeEntity } = require('strapi-utils/lib');

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    // ensure request was not sent as formdata
    if (ctx.is('multipart'))
      return ctx.badRequest('Multipart requests are not accepted!', {
        id: 'Objective.create.format.invalid',
        error: 'ValidationError',
      });

    // ensure the request has the right number of params
    const params = Object.keys(ctx.request.body).length;
    if (params !== 3)
      return ctx.badRequest('Invalid number of params!', {
        id: 'Objective.create.body.invalid',
        error: 'ValidationError',
      });

    // validate the request
    const { description, day, objective_type } = ctx.request.body;
    if (
      !strapi.services.validator.isPositiveInt(day) ||
      !description ||
      !objective_type
    )
      return ctx.badRequest(
        'A classroom and learning standard must be provided!',
        { id: 'Objective.create.body.invalid', error: 'ValidationError' }
      );

    // // get the objective_type
    // const validObjectiveType = await strapi.services['objective-type'].findOne({
    //   name: objective_type,
    // });
    // if (validObjectiveType === null)
    //   return ctx.notFound('The objective type provided is invalid!', {
    //     id: 'Objective.create.day.invalid',
    //     error: 'ValidationError',
    //   });

    // remove private fields and return the new selection
    const objective = await strapi.services.objective.create({
      description,
      day,
      objective_type,
    });
    return sanitizeEntity(objective, { model: strapi.models.objective });
  },
};
