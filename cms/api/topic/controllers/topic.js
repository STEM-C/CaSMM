'use strict';

const { sanitizeEntity } = require('strapi-utils')

module.exports = {
    async find(ctx) {

        let entities;

        if (ctx.query._q) {
            entities = await strapi.services.topic.search(ctx.query)
        } else {
            entities = await strapi.services.topic.find(ctx.query, [
                "type",
                "activities.difficulty",
                "activities.learning_category"
            ])
        }
    
        return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.topic }))
    },
}