'use strict';

// find a session by code
module.exports.findByCode = async (code) => {

    // get the whole session model
    const model = await strapi.query('session').model.where('code', code).fetch()

    // return the model and the session
    return {
        model, 
        session: model ? model.toJSON() : undefined
    }
}

const randomCode = (n) => {

    let code = ''
    for (n; n > 0; n--) {
        code += Math.floor(Math.random()*10)
    }
    return code
}

// TODO: add a maximum number of tries
// generate a code that is unique amongst active sessions
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

        // check if an active session is using the code
        const sessions = await strapi.query('session').findOne({ code, active: true })
        codeExists = sessions !== null
    }
    while (codeExists)
    return code
}