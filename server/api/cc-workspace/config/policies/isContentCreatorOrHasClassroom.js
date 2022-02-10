//
// Check if the current user belongs to this classroom
//
module.exports = async (ctx, next) => {
    
    if (ctx.state.user && ctx.state.user.role.name === 'Content Creator') {
        // Go to next policy or controller
        return await next();
    }
    let classroomId;
    
    // get the target classroom from either the
    // request body or the query params
    const { id } = ctx.params;
    if(id){
        const workspace = await strapi.services['cc-workspace'].findOne({id: id}, ["classroom.id"]);
        if(workspace && workspace.classroom){
            classroomId = workspace.classroom.id;
        }
    }
    else{
        classroomId = ctx.request.body.classroomId;
    }

    const { id: userId } = ctx.state.user
    const { classrooms } = (await strapi.services['classroom-manager'].findById(userId)).classroomManager

    //check if the target classroom is one of the user's classrooms
    if (classrooms.length && classrooms.find(cr => cr.id === classroomId)) {
        return await next()
    }
    
    ctx.unauthorized(`You're not allowed to perform this action!`)
}