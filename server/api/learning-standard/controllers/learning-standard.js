'use strict';

module.exports = {
  /**
   * Retrieve records.
   *
   * @return {Array}
   */

  async find(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services[`learning-standard`].search(ctx.query);
    } else {
      entities = await strapi.services[`learning-standard`].find(ctx.query);
    }

    for (let learnigStandard of entities) {
      if (learnigStandard.unit) {
        const id = parseInt(learnigStandard.unit.grade);
        const grade = await strapi.services[`grade`].findOne({ id });

        learnigStandard.unit.grade = grade.name;
      }
    }

    return entities;
  },
};
