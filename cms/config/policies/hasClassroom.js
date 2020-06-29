//
// Check if the current user belongs to this cla
//
module.exports = async (ctx, next) => {

    // get the target classroom from either the
    // request body or the query params
    let { classroom } = ctx.request.body
    if (!classroom) classroom = ctx.params.id

    // make sure the classroom id
    // is in the proper format
    classroom = parseInt(classroom)

    // get the classrooms that the user has
    const { id: user } = ctx.state
    const { classrooms } = await strapi.services.mentor.findOne({ user })

    // check if the target classroom
    // is one of the user's classrooms
    if (classrooms.length && classrooms.find(cr => cr.id === classroom)) {
        return await next()
    }
  
    ctx.unauthorized(`You're not allowed to perform this action!`)
}