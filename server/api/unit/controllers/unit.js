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
        id: 'Unit.update.format.invalid',
        error: 'ValidationError',
      });

    // ensure the request has the right number of params
    const params = Object.keys(ctx.request.body).length;
    if (params !== 5)
      return ctx.badRequest('Invalid number of params!', {
        id: 'Unit.update.body.invalid',
        error: 'ValidationError',
      });

    // validate the request
    const {
      grade: gradeId,
      name,
      number,
      teks_id,
      teks_description,
    } = ctx.request.body;
    if (
      !strapi.services.validator.isPositiveInt(number) ||
      !strapi.services.validator.isPositiveInt(gradeId) ||
      //!teks_id ||
      !name 
    )
      return ctx.badRequest(
        'A grade, name, teks_description must be provided! Number and Teks_id must be positive interger! ',
        { id: 'Unit.update.body.invalid', error: 'ValidationError' }
      );

    // ensure the grade is valid
    const grade = await strapi.services.grade.findOne({ id: gradeId });
    if (!grade)
      return ctx.notFound('The grade provided is invalid!', {
        id: 'Unit.update.grade.invalid',
        error: 'ValidationError',
      });

    return await strapi.services.unit.update({ id }, ctx.request.body);
  },
};
