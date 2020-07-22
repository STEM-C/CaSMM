'use strict'

module.exports = {

    async toolbox() {

        // get the blocks 
        const blocks = await strapi.services.block.find()
    
        // return the activity id and the toolbox
        return { toolbox: strapi.services.block.blocksToToolbox(blocks) }
    },
}