'use strict';

module.exports = {
  /**
   * Get the current student(s) saves for a day
   *
   * @param {*} ctx
   */
  async findByDay(ctx) {
    const { ids, session } = ctx.state.user;
    const { day } = ctx.params;

    const allSaves = await strapi.services.save.find({ student: ids, day });

    const saves = {
      current: allSaves.find((save) => save.session.id === session),
      past: allSaves.filter((save) => save.session.id !== session),
    };

    return saves;
  },

  async create(ctx) {
    // ensure request was not sent as formdata
    if (ctx.is('multipart'))
      return ctx.badRequest('Multipart requests are not accepted!', {
        id: 'Save.create.format.invalid',
        error: 'ValidationError',
      });

    // ensure the request has the right number of params
    const params = Object.keys(ctx.request.body).length;
    if (params !== 3)
      return ctx.badRequest('Invalid number of params!', {
        id: 'Save.create.body.invalid',
        error: 'ValidationError',
      });

    // validate the request
    // at somept validate the xml...could lead to bad things...
    const { day, workspace, replay } = ctx.request.body;
    if (!strapi.services.validator.isInt(day) || !workspace)
      return ctx.badRequest('A day and workspace must be provided!', {
        id: 'Save.create.body.invalid',
        error: 'ValidationError',
      });

    // ensure the day is valid
    const validDay = await strapi.services.day.findOne({ id: day });
    if (validDay === null)
      return ctx.notFound('The day provided is invalid!', {
        id: 'Save.create.day.invalid',
        error: 'ValidationError',
      });

    // get the current student(s) and session
    const { ids, session } = ctx.state.user;

    // get the save(s) for the student(s) for the target day and session
    const saves = await strapi.services.save.find({
      student: ids,
      day,
      session,
    });

    // create a student saves map
    const studentSaves = {};
    saves.forEach((save) => (studentSaves[save.student.id] = save.id));

    // create/update a save for each student(s)
    return await Promise.all(
      ids.map((id) => {
        // save exists, update
        const saveId = studentSaves[id];
        if (saveId)
          return strapi.services.save.update(
            { id: saveId },
            { workspace, replay }
          );

        // else, create a new save
        return strapi.services.save.create({
          student: id,
          day,
          workspace,
          session,
          replay,
        });
      })
    );
  },
};
