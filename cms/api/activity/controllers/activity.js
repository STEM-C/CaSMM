'use strict'

const { sanitizeEntity } = require('strapi-utils')

const blocksToToolbox = (activity) => {

    let convertedActivity = activity
    let toolbox = {}

    convertedActivity.blocks.forEach(block => {

        const { blocks_category, name, description } = block
        delete block.blocks_category // we don't want this property in the block

        // ignore blocks that don't have a category
        if (!blocks_category) return 

        let convertedBlock = { name, description }

        // append the block to an existing category
        // else create a new category
        if (toolbox[blocks_category.name]) {
            toolbox[blocks_category.name].push(convertedBlock)
        } else {
            toolbox[blocks_category.name] = [convertedBlock]
        }
    })

    convertedActivity.toolbox = Object.entries(toolbox)
    delete convertedActivity.blocks // we don't want this property in the activity
    return convertedActivity
}

module.exports = {
    async find(ctx) {

        let activities

        if (ctx.query._q) {
            activities = await strapi.services.activity.search(ctx.query)
        } else {
            activities = await strapi.services.activity.find(ctx.query, [
                "blocks.blocks_category"
            ])
        }

        return activities.map(activity => sanitizeEntity(activity, { model: strapi.models.activity })).map(blocksToToolbox)
    },
}
