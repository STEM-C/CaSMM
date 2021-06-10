/**
 * @jest-environment node
 */
 'use strict'

 import { getPublicRequestModule, getAuthorizedRequestModule, getMentorLoginData } from './request'
 
 const publicRequest = getPublicRequestModule()
 var adminRequest
 var mentorRequest

 
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
 })
 
 //Tests

 test('Mentor can login', async () => {
    const response = await publicRequest.post('/auth/local', {
        identifier: 'defaultmentor',
        password: '123456'
    })

    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('jwt')
    expect(response.data).toHaveProperty('user')

    mentorRequest = getAuthorizedRequestModule(response.data.jwt)
    // console.log("Mentor Request", response.data.jwt)
     
})

//looking specifically that classroom name, classroom code, and number of students are correct
test('Mentor dashboard information is populated correctly', async () => {
    const response = await mentorRequest.get('/classrooms/1');
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


test('Mentor can view correct day - with the correct blocks populated in day panel per learning standard', async () => {
    const response = await adminRequest.get('/days/1');
    expect(response).toMatchObject({
            "data": { 
                "id": 1,
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




