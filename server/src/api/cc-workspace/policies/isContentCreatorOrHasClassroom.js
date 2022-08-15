//
// Check if the current user belongs to this classroom
//
module.exports = async (policyContext, config, { strapi }) => {
  if (
    policyContext.state.user &&
    policyContext.state.user.role.name === "Content Creator"
  ) {
    // Go to next policy or controller
    return true
  }
  let classroomId

  // get the target classroom from either the
  // request body or the query params
  let { id } = policyContext.params
  if (id) {
    id = parseInt(id)
    const workspace = await strapi.services["cc-workspace"].findOne(
      { id: id },
      ["classroom.id"]
    )
    if (workspace && workspace.classroom) {
      classroomId = workspace.classroom.id
    }
  } else {
    classroomId = policyContext.request.body.classroomId
    classroomId = parseInt(classroomId)
  }

  const { id: userId } = policyContext.state.user
  const { classrooms } = (
    await strapi.services["classroom-manager"].findById(userId)
  ).classroomManager

  //check if the target classroom is one of the user's classrooms
  if (classrooms.length && classrooms.find(cr => cr.id === classroomId)) {
    return true
  }
  return false
}
