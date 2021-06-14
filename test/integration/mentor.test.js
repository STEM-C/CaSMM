/**
 * @jest-environment node
 */
'use strict'

import { getPublicRequestModule, getAuthorizedRequestModule } from './request'

const publicRequest = getPublicRequestModule()
var schoolId  
var userId 
var classroomId 
var learningStandardId,  learningStandardName = 'Something'
var studentId
var unitId, gradeId
var adminRequest
var mentorRequest
var contentcreatorRequest

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
    adminRequest = getAuthorizedRequestModule(admin.jwt)
    //console.log("token: ", admin.jwt)

    const response = await publicRequest.post('/auth/local', {
        identifier: 'defaultmentor',
        password: '123456'
    })

    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('jwt')
    expect(response.data).toHaveProperty('user')

    mentorRequest = getAuthorizedRequestModule(response.data.jwt)

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
    userId = response.data.user.id
    //console.log("userID", userId)
})


test('an unauthenticated user can login', async () => {
    const response = await publicRequest.post('/auth/local', {
        identifier: 'testuser',
        password: '123456'
    })

    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('jwt')
    expect(response.data).toHaveProperty('user')
})

//changed the school, classroom, and user to be what is preloaded into the staging/testing init data
test('an authenticated user can create a mentor profile', async () => {
    const response = await mentorRequest.post('/mentors', {
        first_name: 'test',
        last_name: 'user',
        school: 1,
        classrooms: 1,
        user: 1
    })

    expect(response.status).toBe(200)
})


test.skip('an authenticated user cannot create a mentor profile without user id', async () => {
    const response = await mentorRequest.post('/mentors', {
        first_name: 'test',
        last_name: 'user',
        school: 1,
    })
    expect(response.status).toBe(400)
})

test('an authenticated user can create a teacher profile', async () => {
    const response = await mentorRequest.post('/teachers', {
        first_name: 'test',
        last_name: 'user',
        school: 1,
        user: 3
    })

    expect(response.status).toBe(200)
})


test.skip('an authenticated user cannot create a teacher profile without user id', async () => {
    const response = await mentorRequest.post('/teachers', {
        first_name: 'test',
        last_name: 'user',
        school: 1
    })

    expect(response.status).toBe(400)
})

test('an authenticated user can create a student profile', async () => {
    const response = await mentorRequest.post('/students', {
        name: "Student N.",
        enrolled: true,
        classroom: 1
    })

    expect(response.status).toBe(200)

    //reverting for async tests
    const responseRevert = await mentorRequest.delete('/students/' + response.data.id, {
        name: "Student N."
    })

    expect(responseRevert.status).toBe(200)
})

test('an authenticated user can access own info', async () => {
    const response = await mentorRequest.get('/classroom-managers/me', {})

    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('school')
    expect(response.data).toHaveProperty('classrooms')    
    expect(response.data.classrooms[0].id).toBe(1)
})


test.skip('an unauthenticated user cannot access a classroom', async () => {
    const response = await publicRequest.get(`/classrooms/1`, {})
    expect(response.status).toBe(403)
})

test('an authenticated user can access a classroom by id', async () => {
    const response = await mentorRequest.get(`/classrooms/1`, {})

    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('school')
    expect(response.data).toHaveProperty('students')
    expect(response.data.students[0].id).toBe(1)
    
})

test('an authenticated user can access a learning standards', async () => {
    const response = await mentorRequest.get(`/learning-standards/1`, {})

    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('name')
    expect(response.data.name).toBe('Mixtures and Solutions') 
})

test('an authenticated user can access a classroom by id', async () => {
    const response = await mentorRequest.post(`/selections`, {
        classroom: 1,
        learning_standard: 1
    })

    expect(response.status).toBe(200)
    
})

test('an authenticated user can update a student profile', async () => {
    let response = await mentorRequest.put(`/students/enrolled/1`, {
        enrolled: true
    })
    //console.log("response for enrolled is", response.status)

    expect(response.status).toBe(200)
    studentId = response.data.id

    response = await mentorRequest.get(`/classrooms/1`, {})

    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('school')
    expect(response.data).toHaveProperty('students')
    response.data.students.forEach(student => {
        if(student.id == 1)
            expect(student.enrolled).toBe(true)
    });
    
    
})

test('an authenticated user can access a units by grade', async () => {
    const response = await mentorRequest.get(`/units?grade=4`, {})
    expect(response.status).toBe(200)
    expect(response.data[0].id).toBe(1)
})

test('an authenticated user can access a units', async () => {
    const response = await mentorRequest.get(`/units`, {})
    expect(response.status).toBe(200)
    
})
