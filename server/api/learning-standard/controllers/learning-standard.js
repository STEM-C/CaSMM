'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async update(ctx) {
    const { id } = ctx.params;

    // ensure request was not sent as formdata
    if (ctx.is('multipart'))
      return ctx.badRequest('Multipart requests are not accepted!', {
        id: 'Learning-standard.update.format.invalid',
        error: 'ValidationError',
      });

    // ensure the request has the right number of params
    const params = Object.keys(ctx.request.body).length;
    if (params !== 3)
      return ctx.badRequest('Invalid number of params!', {
        id: 'Learning-standard.update.body.invalid',
        error: 'ValidationError',
      });

    // validate the request
    const { name, expectations, teks } = ctx.request.body;
    if (!expectations || !name || !teks)
      return ctx.badRequest('A name, teks and expectations must be provided!', {
        id: 'Learning-standard.update.body.invalid',
        error: 'ValidationError',
      });

    return await strapi.services['learning-standard'].update(
      { id },
      ctx.request.body
    );
  },
};
