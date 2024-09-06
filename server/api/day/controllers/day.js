'use strict';

const { sanitizeEntity } = require('strapi-utils/lib');

const SCIENCE = 1;
const MAKING = 2;
const COMPUTATION = 3;

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

    // validate the request
    const {
      description,
      images,
      TekS,
      link,
      scienceComponents,
      makingComponents,
      computationComponents,
    } = ctx.request.body;
    //if (!TekS || !description)
      //return ctx.badRequest('A description, Teks must be provided!', {
        //id: 'day.update.body.invalid',
        //error: 'ValidationError',
      //});

    // array to store new component
    let dayComponents = [];

    // add the science components
    scienceComponents.forEach(async (component) => {
      let word = component.trim();
      word = word.charAt(0).toUpperCase() + word.slice(1);
      // find the existing components first
      let foundComponent = await strapi.services['learning-components'].findOne(
        { type: word, learning_component_type: SCIENCE }
      );
      if (foundComponent) {
        dayComponents.push(foundComponent);
      }
      // if component not found, create new ones
      else {
        const newComponent = await strapi.services[
          'learning-components'
        ].create({
          type: word,
          days: id,
          learning_component_type: SCIENCE,
        });
        dayComponents.push(newComponent);
      }
    });

    // add the making components
    makingComponents.forEach(async (component) => {
      let word = component.trim();
      word = word.charAt(0).toUpperCase() + word.slice(1);
      let foundComponent = await strapi.services['learning-components'].findOne(
        { type: word, learning_component_type: MAKING }
      );
      if (foundComponent) {
        dayComponents.push(foundComponent);
      } else {
        const newComponent = await strapi.services[
          'learning-components'
        ].create({
          type: word,
          days: id,
          learning_component_type: MAKING,
        });
        dayComponents.push(newComponent);
      }
    });

    // add the computation components
    computationComponents.forEach(async (component) => {
      let word = component.trim();
      word = word.charAt(0).toUpperCase() + word.slice(1);
      let foundComponent = await strapi.services['learning-components'].findOne(
        { type: word, learning_component_type: COMPUTATION }
      );
      if (foundComponent) {
        dayComponents.push(foundComponent);
      } else {
        const newComponent = await strapi.services[
          'learning-components'
        ].create({
          type: word,
          days: id,
          learning_component_type: COMPUTATION,
        });
        dayComponents.push(newComponent);
      }
    });

    const updatedDay = await strapi.services.day.update(
      { id },
      { description, images, TekS, link, learning_components: dayComponents }
    );
    return sanitizeEntity(updatedDay, { model: strapi.models.day });
  },

  async arduinoUpdate(ctx) {
    const {id} = ctx.params;
    const {arduino, arduinoanswer} = ctx.request.body;
    const day = await strapi.services.day.findOne({ id });
    //console.log(session)
    //console.log(arduino)
    day.template_code = arduino;
    day.template_code_answer = arduinoanswer;
    const updatedDay = await strapi.services.day.update({id}, day);
    return updatedDay

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

  // Update day activity template
  async activityTemplateUpdate(ctx) {
    // find the day
    const { id } = ctx.params;
    let day = await strapi.services.day.findOne({ id: id });
    if (!day)
      return ctx.notFound(
        'The student id provided does not correspond to a valid student!',
        { id: 'day.id.invalid', error: 'ValidationError' }
      );

    // update template and blocks
    day.activity_template = ctx.request.body.activity_template;

    const updatedDay = await strapi.services.day.update({ id: id }, day);
    return sanitizeEntity(updatedDay, { model: strapi.models.day });
  },
};
