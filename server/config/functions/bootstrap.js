'use strict'

const Queue = require('bull')

const initCompileQueue = () => {

    // get queue url
    const url = strapi.config.get('compile_queue.url')

    // connect to queue
    const compile_queue = new Queue('submissions', url);

    // add the submission progress listener
    compile_queue.on('global:progress', strapi.services.submission.updateProgress)
      
    // add the submission complete listener 
    compile_queue.on('global:complete', strapi.services.submission.completeJob)

    // add queue globally
    strapi.connections.compile_queue = compile_queue
} 

const fixRoles = async () => {

    // get all the current roles
    const roles = await strapi.query('role', 'users-permissions').find({}, [])

    // if the authenticated role has the default name, update it 
    const authenticated = roles.find(role => role.type === 'authenticated')
    if (authenticated.name !== 'Classroom Manager') await strapi.query('role', 'users-permissions').update({ id: authenticated.id }, { name: 'Classroom Manager' })

    // if the student role doesn't exist, alert the user
    const student = roles.find(role => role.type === 'student')
    if (!student) console.log('There is currently not a student role! Make sure to make one.')
}

module.exports = async () => {

    // Connect to the compile queue
    initCompileQueue()

    // Check the student roles
    await fixRoles()
}
