//
// Check if the current user belongs to this classroom
//
module.exports = async (ctx, next) => {
  if (ctx.state.user && ctx.state.user.role.name === 'Researcher') {
    return await next();
  }
  // get the target classroom from either the
  // request body or the query params
  let { classroom } = ctx.request.body;
  if (!classroom) classroom = ctx.params.id;

  // make sure the classroom id
  // is in the proper format
  classroom = parseInt(classroom);

  // get the classrooms that the user belongs to
  const { id } = ctx.state.user;
  const { classrooms } = (
    await strapi.services['classroom-manager'].findById(id)
  ).classroomManager;

  // check if the target classroom is one of the user's classrooms
  if (classrooms.length && classrooms.find((cr) => cr.id === classroom)) {
    return await next();
  }

  ctx.unauthorized(`You're not allowed to perform this action!`);
};
