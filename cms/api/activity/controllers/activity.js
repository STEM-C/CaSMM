'use strict'

module.exports = {

    async toolbox(ctx) {

        const { id } = ctx.params

        // get the blocks 
        const blocks = await strapi.services.block.findByActivity(id)

        // return 404 if blocks is undefined
        // (only the case of an activity not existing)
        if (!blocks) return undefined

        // return the activity id and the toolbox
        return {
            id,
            toolbox: strapi.services.block.blocksToToolbox(blocks)
        }
    },
}
