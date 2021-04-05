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
    const adminRequest = getAuthorizedRequestModule(admin.jwt)

    console.log("token: ", admin.jwt)

    // 
    // populate the database
    //
    const { data: school } = await adminRequest.post('/schools', {
        name: 'UF1'
    })
    console.log("School ID: ", school.id)
    schoolId = school.id
    
    const { data: grade } = await adminRequest.post('/grades',{
        name: '11th'
    })
    gradeId = grade.id

    const { data: classroom } = await adminRequest.post('/classrooms', {
        name: 'test',
        school: school.id,
        grade: grade.id
    })
    classroomId = classroom.id
    console.log("This is classroom id", classroomId)

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


//Content Creator Tests


test('content creator can login', async () => {
    const response = await publicRequest.post('/auth/local', {
        identifier: 'defaultcontentcreator',
        password: '123456'
    })

    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('jwt')
    expect(response.data).toHaveProperty('user')

    contentcreatorRequest = getAuthorizedRequestModule(response.data.jwt)
    console.log("Content Creator Request", response.data.jwt)
})

test('content creator can create units', async () => { 
    const response = await contentcreatorRequest.post('/units',{
        name: 'UnitName',
        number: 123,
        grade: gradeId,
        
    })
    expect(response.status).toBe(200)

})

//this will pass on first pass when we actually set unitId 
test('content creator can edit units', async () => {   
    //console.log("unitID: ", unitId)
    //unitId = 2;
    const response = await contentcreatorRequest.put(`/units/${unitId}`,{
        name: "NewUnitName"        
    })
    expect(response.status).toBe(200)

})

//Lily edit - added description/expectation as requirement or the dashboard will error out. 
test('content creator can create learning standard', async () => {
    const response = await contentcreatorRequest.post('/learning-standards',{
        name: 'LS',
        unit: unitId,
        number: 122,
        teks: '2A',
        expectations: "Test expecation description so defaultcontentcreator doesnt error out",

    })
    expect(response.status).toBe(200)

})

//this will pass on first pass when we actually set learningStandardId
test('content creator can edit learning Standards', async () => { 
    const response = await contentcreatorRequest.put(`/learning-standards/${learningStandardId}`,{
        name: 'NewLearningStandard'        
    })
    expect(response.status).toBe(200)

})

test('content creator can create days', async () => {
    const response = await contentcreatorRequest.post('/days',{ //didnt seem to add learning standard 'something' but it did create the day and it passed..
        number: 123,
        learning_standard: learningStandardId,
        template: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="io_digitalwrite" id="j#m#H23NIQH5Wz^I2c^G" x="70" y="224"><field name="PIN">0</field><value name="STATE"><block type="io_highlow" id="7.^n|ek_3R;_Q`K9M!;/"><field name="STATE">HIGH</field></block></value></block></xml>'
        
    })
    expect(response.status).toBe(200)

})

