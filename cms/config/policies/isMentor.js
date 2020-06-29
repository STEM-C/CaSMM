module.exports = async (ctx, next) => {
    if (ctx.state.user.role.name === 'Mentor') {
        // Go to next policy or 
        // the controller
        return await next()
    }
  
    ctx.unauthorized(`You're not allowed to perform this action!`)
}