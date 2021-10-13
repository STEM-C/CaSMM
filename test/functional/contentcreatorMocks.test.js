/**
 * @jest-environment node
 */
 'use strict'

 import { getPublicRequestModule, getAuthorizedRequestModule, getMentorLoginData } from '../functional/request'
 
 const publicRequest = getPublicRequestModule()
 var adminRequest
 var contentcreatorRequest
 
 //
 // Setup before running tests
 //
 
 beforeAll(async () => {
     // login as an admin
     const { data: admin } = await publicRequest.post('/admin/login', {
         email: 'test@mail.com',
         password: '123456'
     })
 
     // create an admin request instance
     adminRequest = getAuthorizedRequestModule(admin.data.token)
 })
 
 //Tests
test('content creator can login', async () => {
    const response = await publicRequest.post('/auth/local', {
        identifier: 'defaultcontentcreator',
        password: '123456'
    })

    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('jwt')
    expect(response.data).toHaveProperty('user')

    contentcreatorRequest = getAuthorizedRequestModule(response.data.jwt)
     //console.log("Content Creator Request", response.data.jwt)
})


test('content creator dashboard contains all grades for dropdown of add unit', async () => {//need work on formatting
    const response = await contentcreatorRequest.get('/grades');

    expect(response).toMatchObject({
        data: 
           [ 
            {
                "id": 1,
                "name": "3rd",
            },
            {
                "id": 3,
                "name": "4th",
            },
            {
                "id": 4,
                "name": "5th",
            },
            ]   
     })
    
})




