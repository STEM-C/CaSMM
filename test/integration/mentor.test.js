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
        username: '',
        email: '',
        password: ''
    })

    console.log(response)

    expect(response.staus).toBe(200)
    expect(response.data).toHaveProperty('jwt')
    expect(response.data).toHaveProperty('user')
})

let mentorRequest
test('an unauthenticated user can login', async () => {
    const response = publicRequest.post('/auth/local', {
        identifier: '',
        password: ''
    })

    expect(response.staus).toBe(200)
    expect(response.data).toHaveProperty('jwt')
    expect(response.data).toHaveProperty('user')

    mentorRequest = getAuthorizedRequestModule(response.data.jwt)
})

test('an authenticated user can create a mentor profile', async () => {
    const response = mentorRequest.post('/mentors', {
        first_name: '',
        last_name: '',
        school: 1
    })

    expect(response.staus).toBe(200)

    console.log(response.data)
})
