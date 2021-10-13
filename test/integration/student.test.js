/**
 * @jest-environment node
 */
'use strict';

import { getPublicRequestModule, getAuthorizedRequestModule } from './request';

const publicRequest = getPublicRequestModule();
var schoolId;
var userId;
var classroomId;
var learningStandardId,
  learningStandardName = 'Something';
var studentId;
var unitId, gradeId;
var adminRequest;
var mentorRequest;
var contentcreatorRequest;

//
// Setup before running tests
//
beforeAll(async () => {
  // login as an admin
  const { data: admin } = await publicRequest.post('/admin/login', {
    email: 'test@mail.com',
    password: '123456',
  });
  // console.log("admin token: ", admin.data)
  adminRequest = getAuthorizedRequestModule(admin.data.token);

  //
  // populate the database
  //
  const { data: school } = await adminRequest.post('/schools', {
    name: 'UF1',
  });
  console.log('School ID: ', school.id);
  schoolId = school.id;

  const { data: grade } = await adminRequest.post('/grades', {
    name: '11th',
  });
  gradeId = grade.id;

  const { data: classroom } = await adminRequest.post('/classrooms', {
    name: 'test',
    school: school.id,
    grade: grade.id,
  });
  classroomId = classroom.id;
  console.log('This is classroom id', classroomId);

  const { data: learningStandard } = await adminRequest.post(
    '/learning-standards',
    {
      number: 1.1,
      name: learningStandardName,
    }
  );

  learningStandardId = learningStandard.id;

  const { data: units } = await adminRequest.post('units', {
    number: 1,
    name: 'Unit',
    grade: gradeId,
  });

  unitId = units.id;
});

//Student Tests

test.skip('student can login', async () => {
  const response = await publicRequest.post('/', {
    identifier: '0450',
  });

  expect(response.status).toBe(200);
});
