'use strict';

// find a classroom manager by user id
module.exports.findById = async (id) => {
  const mentor = await strapi.services.mentor.findOne({ user: id });
  return {
    classroomManager: mentor,
  };
};

// find all classes for a classroom manager
module.exports.findClassesById = async (id) => {
  const mentor = await strapi.services.mentor.findOne({ user: id });
  const classrooms = mentor.classrooms;

  const crList = await Promise.all(
    classrooms.map(async (classroom) => {
      const model = await strapi
        .query('classroom')
        .model.where('id', classroom.id)
        .fetch();
      return model ? model.toJSON() : undefined;
    })
  );

  return crList;
};
