//
// Check if the current user belongs to
// the session's classroom
//
module.exports = async (ctx, next) => {

    // get the target session from either the
    // request body or the query params
    let { session: sessionId } = ctx.request.body
    if (!sessionId) sessionId = ctx.params.id

    // make sure the session id
    // is in the proper format
    sessionId = parseInt(sessionId)

    // get the target session and check if it exists
    const targetSesssion = await strapi.services.session.findOne({ id: sessionId })
    if (!targetSesssion) return ctx.unauthorized(`You're not allowed to perform this action!`)

    // get the classrooms that the user belongs to
    const { id: user } = ctx.state.user
    const { classrooms } = await strapi.services.mentor.findOne({ user })

    // check if the target session's classroom
    // is one of the user's classrooms
    if (classrooms.length && classrooms.find(cr => cr.id === targetSesssion.classroom.id)) {
        return await next()
    }
  
    ctx.unauthorized(`You're not allowed to perform this action!`)
}