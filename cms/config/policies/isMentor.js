//
// Check if the current user is a mentor
//
module.exports = async (ctx, next) => {
    if (ctx.state.user && ctx.state.user.role.name === 'Mentor') {
        return await next()
    }
  
    ctx.unauthorized(`You're not allowed to perform this action!`)
}