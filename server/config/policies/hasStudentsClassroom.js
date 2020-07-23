//
// Check if the current user manages a classroom that this student belongs to
//
module.exports = async (ctx, next) => {

    // get the target student from either the
    // request body or the query params
    let { student } = ctx.request.body
    if (!student) student = ctx.params.id

    // make sure the student id
    // is in the proper format
    student = parseInt(student)

    // get the classrooms that the user belongs to
    const { id } = ctx.state.user
    const classrooms = await strapi.services['classroom-manager'].findClassesById(id)


    // check if the target student is in one of the user's classrooms
    if (classrooms.length && classrooms.some(classroom => {
        return classroom.students.some(s => {
            return s.id === student
        })
    })) {
        return await next()
    }

    ctx.unauthorized(`You're not allowed to perform this action!`)
}