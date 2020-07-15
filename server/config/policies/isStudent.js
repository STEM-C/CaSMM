//
// Check if the current user is a student
//
module.exports = async (ctx, next) => {
    if (ctx.state.user && ctx.state.user.isStudent) {
        // Go to next policy or controller
        return await next()
    }
  
    ctx.unauthorized(`You're not allowed to perform this action!`)
}