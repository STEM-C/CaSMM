'use strict';

// find a classroom by code
module.exports.findByCode = async (code) => {

    // get the whole classroom model
    const model = await strapi.query('classroom').model.where('code', code).fetch()

    // return the model and the classroom
    return {
        model, 
        classroom: model ? model.toJSON() : undefined
    }
}

const randomCode = (n) => {

    let code = ''
    for (n; n > 0; n--)
        code += Math.floor(Math.random()*10)
    return code
}

// TODO: add a maximum number of tries
// generate a code that is unique amongst classroom
module.exports.getUniqueCode = async (currentCode = undefined) => {

    let code = currentCode
    let codeExists
    do {
        // allow an existing code to be passed,
        // checking if it active and returning
        // a new code if it is being used
        if (!code) {
            // get a four digit code
            code = randomCode(4)
        }

        // check if a classroom is using the code
        const classroom = await strapi.query('classroom').findOne({ code })
        codeExists = classroom !== null
    }
    while (codeExists)
    return code
}