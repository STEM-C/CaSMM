'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports.findCurrSelection = async (classroomId) => {
  const selection = await strapi
    .query('selection')
    .findOne({ current: true, classroom: classroomId, _sort: 'id:desc' }, [
      'learning_standard',
    ]);
  return selection;
};
