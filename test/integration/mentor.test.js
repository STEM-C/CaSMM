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

    // 
    // populate the database
    //
    const { data: school } = await adminRequest.post('/schools', {
        name: 'UF',
        county: '',
        state: ''
    })
    schoolId = school.id
    
    const { data: grade } = await adminRequest.post('/grades',{
        name: '7th'
    })
    gradeId = grade.id

    const { data: classroom } = await adminRequest.post('/classrooms', {
        name: 'test',
        school: school.id,
        grade: grade.id
    })
    classroomId = classroom.id

    const { data: learningStandard } = await adminRequest.post('/learning-standards', {
        number: 1.1,
        name: learningStandardName
    })

    learningStandardId = learningStandard.id

    const { data: units } = await adminRequest.post('units', {
        number: 1,
        name: 'Unit',
        grade: gradeId
    })
    
    unitId = units.id
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
        school: schoolId,
        classrooms: classroomId,
        user: userId
    })

    expect(response.status).toBe(200)
})


test.skip('an authenticated user cannot create a mentor profile without user id', async () => {
    const response = await mentorRequest.post('/mentors', {
        first_name: 'test',
        last_name: 'user',
        school: schoolId,
    })
    console.log(response.status)
    expect(response.status).toBe(400)
})

test('an authenticated user can create a teacher profile', async () => {
    const response = await mentorRequest.post('/teachers', {
        first_name: 'test',
        last_name: 'user',
        school: schoolId,
        user: userId
    })

    expect(response.status).toBe(200)
})


test.skip('an authenticated user cannot create a teacher profile without user id', async () => {
    const response = await mentorRequest.post('/teachers', {
        first_name: 'test',
        last_name: 'user',
        school: schoolId
    })
    console.log(response.status)
    expect(response.status).toBe(400)
})

test('an authenticated user can create a student profile', async () => {
    const response = await mentorRequest.post('/students', {
        name: 'Student',
        classroom: classroomId
    })

    expect(response.status).toBe(200)
    studentId = response.data.id
})

test('an authenticated user can access own info', async () => {
    const response = await mentorRequest.get('/classroom-managers/me', {})
    console.log(response.data)
    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('school')
    expect(response.data).toHaveProperty('classrooms')    
    expect(response.data.classrooms[0].id).toBe(classroomId)

})


test.skip('an unauthenticated user cannot access a classroom', async () => {
    const response = await publicRequest.get(`/classrooms/${classroomId}`, {})

    expect(response.status).toBe(403)
    
})

test('an authenticated user can access a classroom by id', async () => {

    const response = await mentorRequest.get(`/classrooms/${classroomId}`, {})

    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('school')
    expect(response.data).toHaveProperty('students')
    expect(response.data.students[0].id).toBe(studentId)
    
})

test('an authenticated user can access a learning standards', async () => {

    const response = await mentorRequest.get(`/learning-standards/${learningStandardId}`, {})

    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('name')
    expect(response.data.name).toBe(learningStandardName)
    
})


test('an authenticated user can access a classroom by id', async () => {

    const response = await mentorRequest.post(`/selections`, {
        classroom: classroomId,
        learning_standard: learningStandardId
    })

    expect(response.status).toBe(200)
    
})

test('an authenticated user can update a student profile', async () => {
    const { data: newClassroom } = await adminRequest.post('/classrooms', {
        name: 'test1',
        school: schoolId,
        grade: gradeId
    })
    let response
    
    response = await mentorRequest.put(`/students/${studentId}`, {
        classroom: newClassroom.id
    })

    expect(response.status).toBe(200)
    studentId = response.data.id

    response = await mentorRequest.get(`/classrooms/${classroomId}`, {})

    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('school')
    expect(response.data).toHaveProperty('students')
    expect(response.data.students[0]).toBe(undefined)
    
})

test('an authenticated user can access a units by grade', async () => {

    const response = await mentorRequest.get(`/units?grade=${gradeId}`, {})

    expect(response.status).toBe(200)
    expect(response.data[0].id).toBe(unitId)
})

test('an authenticated user can access a units', async () => {

    const response = await mentorRequest.get(`/units`, {})

    expect(response.status).toBe(200)
    
})
