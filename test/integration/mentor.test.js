'use strict'

import { getPublicRequestModule, getAuthorizedRequestModule } from './request'

const publicRequest = getPublicRequestModule()

//
// Setup before running tests
//
beforeAll(async () => {

    // login as an admin
    const { data: admin } = await publicRequest.post('/admin/auth/local', {
        identifier: 'test',
        password: '123456'
    })

    // create an admin request instance
    const adminRequest = getAuthorizedRequestModule(admin.jwt)

    // 
    // populate the database
    //
    const { data: school } = await adminRequest.post('/schools', {
        name: '',
        county: '',
        state: ''
    })

    const { data: classroom } = await adminRequest.post('/classrooms', {
        name: '',
        teacher: '',
        school: school.id
    })
})

//
// Mentor tests
//
// Auth - https://strapi.io/documentation/v3.x/plugins/users-permissions.html#authentication
//

test('an unauthenticated user can register', async () => {
    const response = await publicRequest.post('/auth/local/register', {
        username: 'testuser',
        email: 'tu@mail.com',
        password: '123456'
    })

    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('jwt')
    expect(response.data).toHaveProperty('user')
})

let mentorRequest
test('an unauthenticated user can login', async () => {
    const response = await publicRequest.post('/auth/local', {
        identifier: 'testuser',
        password: '123456'
    })

    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('jwt')
    expect(response.data).toHaveProperty('user')

    mentorRequest = getAuthorizedRequestModule(response.data.jwt)
})

test('an authenticated user can create a mentor profile', async () => {
    const response = await mentorRequest.post('/mentors', {
        first_name: 'test',
        last_name: 'user',
        school: 1
    })

    console.log(response)

    expect(response.status).toBe(200)
})
