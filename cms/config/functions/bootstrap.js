'use strict'

module.exports = async () => {

    // get all the current roles
    const roles = await strapi.query('role', 'users-permissions').find({}, [])

    // if the authenticated role has the default name, update it 
    const authenticated = roles.find(role => role.type === 'authenticated')
    if (authenticated.name !== 'Classroom Manager') await strapi.query('role', 'users-permissions').update({ id: authenticated.id }, { name: 'Classroom Manager' })

    // if the student role doesn't exist, alert the user
    const student = roles.find(role => role.type === 'student')
    if (!student) console.log('There is currently not a student role! Make sure to make one.')
}
