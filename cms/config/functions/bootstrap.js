'use strict'

module.exports = async () => {

    // get all the current roles
    const roles = await strapi.query('role', 'users-permissions').find({}, [])

    // if the authenticated role has the default name, update it 
    const authenticated = roles.find(role => role.type === 'authenticated')
    if (authenticated.name !== 'Classroom Manager') await strapi.query('role', 'users-permissions').update({ id: authenticated.id }, { name: 'Classroom Manager' })

    // if the student role doesn't exist, create it
    const student = roles.find(role => role.type === 'student')
    if (!student) await strapi.query('role', 'users-permissions').create({ name: 'Student', description: 'Default role give to a student user.', type: 'student' })
}
