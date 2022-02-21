'use strict';

const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {
  /**
   * Create a selection and disable other selections
   *
   * @return {Object}
   */
  async create(ctx) {
    // ensure request was not sent as formdata
    if (ctx.is('multipart'))
      return ctx.badRequest('Multipart requests are not accepted!', {
        id: 'Selection.create.format.invalid',
        error: 'ValidationError',
      });

    // ensure the request has the right number of params
    const params = Object.keys(ctx.request.body).length;
    if (params !== 2)
      return ctx.badRequest('Invalid number of params!', {
        id: 'Selection.create.body.invalid',
        error: 'ValidationError',
      });

    // validate the request
    const { classroom, learning_standard } = ctx.request.body;
    if (
      !strapi.services.validator.isInt(classroom) ||
      !strapi.services.validator.isInt(learning_standard)
    )
      return ctx.badRequest(
        'A classroom and learning standard must be provided!',
        { id: 'Selection.create.body.invalid', error: 'ValidationError' }
      );

    // ensure the learning standard is valid
    const validStandard = await strapi.services['learning-standard'].findOne({
      id: learning_standard,
    });
    if (validStandard === null)
      return ctx.notFound('The learning standard provided is invalid!', {
        id: 'Selection.create.learning_standard.invalid',
        error: 'ValidationError',
      });

    // try to disable the current selection for the classroom
    try {
      const entry = await strapi
        .query('selection')
        .update({ classroom, current: true }, { current: false });
    } catch (err) {
      // on the first selection a 404 will be thrown
      console.log(`First selection for classroom ${classroom}`);
    }

    // remove private fields and return the new selection
    const selection = await strapi.services.selection.create({
      classroom,
      learning_standard,
    });
    return sanitizeEntity(selection, { model: strapi.models.selection });
  },
};
