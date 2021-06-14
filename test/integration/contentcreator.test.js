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
        identifier: 'defaultcontentcreator',
        password: '123456'
    })

    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('jwt')
    expect(response.data).toHaveProperty('user')

    contentcreatorRequest = getAuthorizedRequestModule(response.data.jwt)
    //console.log("Content Creator Request", response.data.jwt)
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
})

test('content creator can create units', async () => { 
    const response = await contentcreatorRequest.post('/units',{
        name: 'UnitName',
        number: 123,
        grade: 5,
        
    })
    expect(response.status).toBe(200)

    //reverting for async tests
    const responseDelete = await contentcreatorRequest.delete('/units/'+response.data.id,{
        name: 'UnitName'
    })
    expect(responseDelete.status).toBe(200)

})

test('content creator can edit units', async () => {   
    const response = await contentcreatorRequest.put(`/units/1`,{ //changed the unitID to be what is preloaded already 
        name: "NewUnitName"        
    })
    expect(response.status).toBe(200)

    //Reverting it back to what it was for async tests
    const responseRevert = await contentcreatorRequest.put(`/units/1`,{ //changed the unitID to be what is preloaded already 
        name: "Unit Name"        
    })
    expect(responseRevert.status).toBe(200)

})
 
test('content creator can create learning standard', async () => {
    const response = await contentcreatorRequest.post('/learning-standards',{
        name: 'LS',
        unit: 1,
        number: 122,
        teks: '2A',
        expectations: "Test expecation description so defaultcontentcreator doesnt error out",

    })
    expect(response.status).toBe(200)
    
    //Deleting for async tests 
    const responseDelete = await contentcreatorRequest.delete('/learning-standards/' + response.data.id,{
        name: 'LS',
        unit: 1,
        number: 122,
        teks: '2A',
        expectations: "Test expecation description so defaultcontentcreator doesnt error out",

    })

    expect(responseDelete.status).toBe(200)
})

test('content creator can edit learning Standards', async () => { 
    const response = await contentcreatorRequest.put(`/learning-standards/1`,{ //changed learned standard to be what is alread preloaded 
        name: 'NewLearningStandard'        
    })
    expect(response.status).toBe(200)
    
    //reverting it back to what it was - for async tests
    const responseRevert = await contentcreatorRequest.put(`/learning-standards/1`,{ 
        name: 'Mixtures and Solutions'        
    })
    expect(responseRevert.status).toBe(200)

})

//just modified the learning_standard to be hardcoded to the data that is preloaded into the database
test('content creator can create days', async () => {
    const response = await contentcreatorRequest.post('/days',{ 
        number: 123,
        learning_standard: 1,
        template: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="io_digitalwrite" id="j#m#H23NIQH5Wz^I2c^G" x="70" y="224"><field name="PIN">0</field><value name="STATE"><block type="io_highlow" id="7.^n|ek_3R;_Q`K9M!;/"><field name="STATE">HIGH</field></block></value></block></xml>'
        
    })
    expect(response.status).toBe(200)

    //reverting for async
    const responseDelete = await contentcreatorRequest.delete('/days/'+ response.data.id,{ 
        number: 123,
    })
    expect(responseDelete.status).toBe(200)

})

