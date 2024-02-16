'use strict'



module.exports = {



    async create(ctx) {
        const {email, password, role} = ctx.request.body

        if (email) {
            return await Promise.all(email.map(users => {
           //     // validate the request
             //   if (typeof users.name !== "string" || !users.name) return ctx.badRequest(
               //     'A name must be provided!',
                 //   {id: 'User.create.body.invalid', error: 'ValidationError'}
               // )

                return strapi.services.users.create({
                    Username: email,
                    Email: email,
                    Password: password,
                    Role: role
                })
            }))
        }

        // validate the request
        //const {email} = ctx.request.body
        //if (typeof name !== "string" || !name) return ctx.badRequest(
         //   'A name must be provided!',
         //   {id: 'Student.create.body.invalid', error: 'ValidationError'}
       // )

        return strapi.services.users.create(ctx.request.body)
    }
}
