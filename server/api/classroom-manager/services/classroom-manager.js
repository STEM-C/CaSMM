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

// find all classes for a classroom manager
module.exports.findClassesById = async (id) => {

    const [ mentor, teacher ] = await Promise.all(['mentor', 'teacher'].map(async type =>
        strapi.services[type].findOne({ user: id })
    ));
    const classrooms = mentor ? mentor.classrooms : teacher.classrooms;

    const crList = await Promise.all(classrooms.map(async classroom => {
        const model = await strapi.query('classroom').model.where('id', classroom.id).fetch();
        return model ? model.toJSON() : undefined;
    }));

    return crList
}