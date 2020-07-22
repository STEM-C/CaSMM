'use strict';

// find a classroom manager by user id
module.exports.findById = async (id) => {

    const [ mentor, teacher ] = await Promise.all(['mentor', 'teacher'].map(async type => 
        strapi.services[type].findOne({ user: id })
    ))

    return {
        classroomManager: mentor ? mentor : teacher,
        type: mentor ? 'mentor' : 'teacher'
    }
}