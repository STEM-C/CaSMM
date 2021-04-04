/**
 * @jest-environment node
 */
 'use strict'

 import { getPublicRequestModule, getAuthorizedRequestModule, getMentorLoginData } from '../functional/request'
 
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
 var mentorToken //calling different times gives diff tokens
 var adminToken 
 
 //
 // Setup before running tests
 //
 /*
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
 */
 //Tests

 //localhost:1337/api/classrooms/join/0450
 //const axios = require('axios');
 //jest.mock('axios')

 /*
mentor:
dashboard main calls are:
-classroom/1: gets the students and classroom data
-learning_standard/1: gets the classroom descriptions and such

 */

/*
content creator:
3/25/21: issue in testing env where initally some of the learning standards have null expectation descriptions and it fails to load page
        fix: every learning standard needs to have some kind of text in it

Create (some kind of) test to make sure that functionality of the addition of "something" still makes the web function

ccdashboard main calls:
- /grades  ;; these are actual year grades - not student grades
-/units
-/learning-standards


*/
//tomatchobject - or ; objectcontaining - and->unlelss property specified


 //logging in prepopulated mentor - classroom 0450 ; name: basic mentor
 test('Mentor can login', async () => {
    const response = await publicRequest.post('/auth/local', {
        identifier: 'defaultmentor',
        password: '123456'
    })

    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('jwt')
    expect(response.data).toHaveProperty('user')

    mentorRequest = getAuthorizedRequestModule(response.data.jwt)
     console.log("Mentor Request", response.data.jwt)
     mentorToken = response.data.jwt
})

//looking specifically that classroom name, classroom code, and number of students are correct
test('Mentor dashboard information is populated correctly', async () => {
    const response = await mentorRequest.get('/classrooms/1');

    //const response = getMentorLoginData(mentorToken);
    //console.log("Mentor Request2", mentorToken)
    expect(response).toMatchObject(({
        "data": 
            {
                "name": "Pedro's Science Classroom",
                "code": "0450",
                "students":
                   [ {
                        "character": "🦍",
                        "id": 1,
                        "name": "Nick I.",
                      },
                    {
                        "character": "🐼",
                        "id": 2,
                        "name": "Adam T.",
                      },
                    {
                        "character": "🤡",
                        "id": 3,
                        "name": "Dakota R.",
                      },
                   ],             
            },     
     })
    )

})

test('Mentor dashboard contains correct learning standards', async () =>{
    const response = await mentorRequest.get('/learning-standards/1');
    expect(response).toEqual(expect.objectContaining({
        "data": expect.objectContaining({
            "name": "Mixtures and Solutions",
            "expectations": "Demonstrate that some mixtures maintain physical properties of their ingredients such as iron fillings and sand and sand and water.\nIdentify changes that can occur in the physical properties of the ingredients or solutions such as dissolving salt in water or adding lemon juice to water.",
        })
    }))
})

test('Mentor dashboard contains correct days', async () => {
    

})

test('Mentor can view correct day - with the correct blocks populated in day panel per learning standard', async () => {
    const response = await mentorRequest.get('/days/1');
    expect(response).toMatchObject({
            "data": { 
                "id": "1",
                "learning_standard": {
                    "id": 1,
                    "unit": 1,
                    "number": 1.3,
                },
                "number": "1",
                "template": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"><block type=\"controls_if\" id=\"QJ(1[6#4Ys@+p~@Ryl|Z\" x=\"117\" y=\"178\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"x5M=__I|GXzRT:u6nz]_\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"math_number\" id=\"?L[7sHbFFX{X-d({Qgi!\"><field name=\"NUM\">0</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"qfOmU9isz_01I8~u#sSW\"><field name=\"NUM\">0</field></block></value></block></value><statement name=\"DO0\"><block type=\"math_change\" id=\";y@:{=LW6[@|j,1*.6C]\"><field name=\"VAR\">item</field><value name=\"DELTA\"><block type=\"math_number\" id=\"m0.eI+XUsK/KXsTo3}#B\"><field name=\"NUM\">0</field></block></value></block></statement></block></xml>",
                "blocks": [
                    {
                        "id": 1,
                        "name": "controls_if",
                    },
                    {
                        "id": 3,
                        "name": "controls_for",
                    },
                    {
                        "id": 5,
                        "name": "logic_operation",
                    }
                ]
            }

    })

})

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
            {
                "id": 5,
                "name": "11th",
            }  ]   
     })
    
})

//test('content creator dashboard contains all units for dropdown of add learning standard', async () =>{
 //   const response = await contentcreatorRequest.get('/grades');
//})

//test('content creator has access to correct days ')

