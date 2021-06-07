/**
 * @jest-environment node
 */
 'use strict'

 import { getPublicRequestModule, getAuthorizedRequestModule, getStudentLoginData, getStudents, getStudentClassroom, postJoin } from './request'
 
 const publicRequest = getPublicRequestModule()
 var adminRequest
var studentRequest
 
 //Tests

 //localhost:1337/api/classrooms/join/0450
 beforeAll(async () => {
       const { data: admin } = await publicRequest.post('/admin/auth/local', {
            identifier: 'test',
             password: '123456'
      })
    adminRequest = getAuthorizedRequestModule(admin.jwt)
    //console.log("admin token: ", admin.jwt)
 })


 test('student login drop down data is populated correctly' , async () => {
     const response = await adminRequest.get(`/classrooms/join/0450`);
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
    })
 })

 test('A user can login with classroom code', async () => {
   const response = await adminRequest.get(`/classrooms/join/0450`);
    expect(response.status).toBe(200)
})

test('A student can login', async () =>{
  const res = await postJoin('0450',[1,2,3]);

  expect(res.data).toHaveProperty('jwt');
  //console.log("student token", res.data.jwt);
   studentRequest = getAuthorizedRequestModule(res.data.jwt);
})

test('student can view day selections', async () => {
    const response = await studentRequest.get('/classrooms/student');
    expect(response).toMatchObject({
      "data":  {
             "learning_standard":  {
               "days":[
                 {
                 "id": 1,
                   "learning_standard": 1,
                   "number": "1",
                   "template": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"><block type=\"controls_if\" id=\"QJ(1[6#4Ys@+p~@Ryl|Z\" x=\"117\" y=\"178\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"x5M=__I|GXzRT:u6nz]_\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"math_number\" id=\"?L[7sHbFFX{X-d({Qgi!\"><field name=\"NUM\">0</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"qfOmU9isz_01I8~u#sSW\"><field name=\"NUM\">0</field></block></value></block></value><statement name=\"DO0\"><block type=\"math_change\" id=\";y@:{=LW6[@|j,1*.6C]\"><field name=\"VAR\">item</field><value name=\"DELTA\"><block type=\"math_number\" id=\"m0.eI+XUsK/KXsTo3}#B\"><field name=\"NUM\">0</field></block></value></block></statement></block></xml>",
                 },
                  {
                   "id": 2,
                 "learning_standard": 1,
                 "number": "2",
                   "template": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"><block type=\"controls_if\" id=\"+tDwx%uD*;|/%MoHiBuD\" x=\"72\" y=\"141\"><value name=\"IF0\"><block type=\"variables_get\" id=\"iQ,uNAfjOn;[Fhd|~lzS\"><field name=\"VAR\">item</field></block></value></block></xml>",
                },
                {
                   "id": 3,
                   "learning_standard": 1,
                  "number": "3",
                "template": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"><block type=\"io_digitalwrite\" id=\"j#m#H23NIQH5Wz^I2c^G\" x=\"70\" y=\"224\"><field name=\"PIN\">0</field><value name=\"STATE\"><block type=\"io_highlow\" id=\"7.^n|ek_3R;_Q`K9M!;/\"><field name=\"STATE\">HIGH</field></block></value></block></xml>",
                 }]}
           }
    })
})
