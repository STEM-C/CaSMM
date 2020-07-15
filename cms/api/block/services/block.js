'use strict'

// get all the blocks for an activity
module.exports.findByActivity = async (id) => {

    // get the target activity
    const activity = await strapi.services.activity.findOne({ id }, ['blocks.blocks_category'])

    // return the blocks only if the activity is found
    return activity ? activity.blocks : undefined
}

// create a blockly friendly toolbox from blocks
module.exports.blocksToToolbox = (blocks) => {

    let toolbox = {}
    blocks.forEach(block => {

        // validate the block fields
        const { blocks_category, name, description } = block
        if (!blocks_category) return 

        // only take the required fields from the block
        let sanitizedBlock = { name, description }

        // append the block to an existing category
        // else create a new category
        if (toolbox[blocks_category.name]) {
            toolbox[blocks_category.name].push(sanitizedBlock)
        } else {
            toolbox[blocks_category.name] = [sanitizedBlock]
        }
    })

    return Object.entries(toolbox)
}