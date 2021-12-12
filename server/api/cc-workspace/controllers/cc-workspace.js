'use strict';

const { sanitizeEntity } = require('strapi-utils/lib');

module.exports = {
  // Update day template and block list
  async update(ctx) {
    // find the day
    const { id } = ctx.params;
    let workspace = await strapi.services[cc - workspace].findOne({ id: id });
    if (!workspace)
      return ctx.notFound('Invalid workspace id', {
        id: 'day.id.invalid',
        error: 'ValidationError',
      });

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
