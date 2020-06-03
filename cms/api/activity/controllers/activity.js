'use strict'

const blocksToToolbox = (blocks) => {

    let toolbox = {}
    blocks.forEach(block => {

        const { blocks_category, name, description } = block
        if (!blocks_category) return 

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

module.exports = {

    async toolbox(ctx) {

        const { id } = ctx.params

        let result = await strapi
            .query('block').model // gets the underlying bookshelf model
            .query(qb => { // get only the blocks belonging to the activity
                qb.join('activities__blocks', 'blocks.id', 'activities__blocks.block_id')
                  .where('activities__blocks.activity_id', id)
            })
            .fetchAll({ // get the related blocks_category data
                withRelated: ['blocks_category']
            })

        let response = {
            id,
            toolbox: blocksToToolbox(result.toJSON())
        }

        return response
    },
}
