'use strict';

const { sanitizeEntity } = require('strapi-utils/lib');

module.exports = {
  // update day description and objective
  async update(ctx) {
    const { id } = ctx.params;

    // ensure request was not sent as formdata
    if (ctx.is('multipart'))
      return ctx.badRequest('Multipart requests are not accepted!', {
        id: 'day.update.format.invalid',
        error: 'ValidationError',
      });

    // ensure the request has the right number of params
    const params = Object.keys(ctx.request.body).length;
    if (params !== 3)
      return ctx.badRequest('Invalid number of params!', {
        id: 'day.update.body.invalid',
        error: 'ValidationError',
      });

    // validate the request
    const { description, TekS, objectives } = ctx.request.body;
    if (!TekS || !description || objectives.length !== 3)
      return ctx.badRequest(
        'A description, Teks must be provided! Must have 3 objectives! ',
        { id: 'day.update.body.invalid', error: 'ValidationError' }
      );

    // Get objective types
    const objective_types = await strapi.services['objective-type'].find({});

    // Create Objectives
    const scienceObj = await strapi.services.objective.create({
      description: objectives[0],
      day: id,
      objective_type: objective_types[0],
    });
    const makingObj = await strapi.services.objective.create({
      description: objectives[1],
      day: id,
      objective_type: objective_types[1],
    });
    const computationObj = await strapi.services.objective.create({
      description: objectives[2],
      day: id,
      objective_type: objective_types[2],
    });
    // put the three objective into an array
    const validObjectives = [scienceObj, makingObj, computationObj];

    // update the day
    return await strapi.services.day.update(
      { id },
      { description, TekS, validObjectives }
    );
  },

  // Update day template and block list
  async templateUpdate(ctx) {
    // find the day
    const { id } = ctx.params;
    let day = await strapi.services.day.findOne({ id: id });
    if (!day)
      return ctx.notFound(
        'The student id provided does not correspond to a valid student!',
        { id: 'day.id.invalid', error: 'ValidationError' }
      );

    // update template and blocks
    day.template = ctx.request.body.template;
    let unfriendlyBlocks = ctx.request.body.blocks;
    let friendlyBlocks = [];
    for (let i = 0; i < unfriendlyBlocks.length; i++) {
      let currentBlock = await strapi.services.block.findOne({
        name: unfriendlyBlocks[i],
      });
      friendlyBlocks.push(currentBlock);
    }
    day.blocks = friendlyBlocks;

    const updatedDay = await strapi.services.day.update({ id: id }, day);
    return sanitizeEntity(updatedDay, { model: strapi.models.day });
  },

  async toolbox(ctx) {
    const { id } = ctx.params;

    // get the blocks
    const blocks = await strapi.services.block.findByDay(id);

    // return 404 if blocks is undefined
    // (only the case of a day not existing)
    if (!blocks) return undefined;

    // return the day id and the toolbox
    return {
      id,
      toolbox: strapi.services.block.blocksToToolbox(blocks),
    };
  },
};
