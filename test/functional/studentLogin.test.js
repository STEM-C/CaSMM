/**
 * @jest-environment node
 */
 'use strict'

 import { getPublicRequestModule, getAuthorizedRequestModule, getStudentLoginData, getStudents, getStudentClassroom, postJoin } from '../functional/request'
 
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
 var adminToken
var studentRequest
 
 //Tests

 //localhost:1337/api/classrooms/join/0450

 test('student login drop down data is populated correctly' , async () => {
    const { data: admin } = await publicRequest.post('/admin/auth/local', {
        identifier: 'test',
        password: '123456'
    })
    adminRequest = getAuthorizedRequestModule(admin.jwt)

     const response = await getStudentLoginData(admin.jwt);
     console.log("admin token: ", admin.jwt)
     adminToken = admin.jwt;


     expect(response).toMatchObject({
       "data": [
                 {
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
               "err": null,
     
    })
  

 })

 test('student can login', async () => {
    //const response = await getStudents('0450', adminToken);
    const response = await adminRequest.get(`/classrooms/join/0450`);


    expect(response.status).toBe(200)
})

//student.js
test('student can view day selections', async () => {
    //const response = await getStudentClassroom(adminToken);

    const res = await postJoin('0450', 3, adminToken);
    studentRequest = getAuthorizedRequestModule(res.data);
    console.log("Student token: ", res.data);

    const response = await studentRequest.get('/classrooms/student');
    expect(response).toMatchObject({
        "data": [
            {
               "character": "🦍",
               "id": 1,
               "name": "Nick I.",
             },
          ],
          "err": null,

    })
})
test('correct day save is received in specific day workspace for student', async () =>{
    const response = await adminRequest.get('/classrooms/student');

})