'use strict';

const { sanitizeEntity } = require('strapi-utils')

module.exports = {
    async find(ctx) {

        // nested fields that we want 
        // to populate in the queries
        const populate = [
            "type",
            "activities.difficulty",
            "activities.learning_category"
        ]

        let topics
        if (ctx.query._q) {
            // perform a search of all fields that allow it
            topics = await strapi.services.topic.search(ctx.query, populate)
        } else {
            topics = await strapi.services.topic.find(ctx.query, populate)
        }
    
        // remove private fields from the response
        return topics.map(topic => sanitizeEntity(topic, { model: strapi.models.topic }))
    },
}