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

  //console.log("token: ", admin.jwt)

  const response = await publicRequest.post('/auth/local', {
    identifier: 'defaultcontentcreator',
    password: '123456',
  });

  expect(response.status).toBe(200);
  expect(response.data).toHaveProperty('jwt');
  expect(response.data).toHaveProperty('user');

  contentcreatorRequest = getAuthorizedRequestModule(response.data.jwt);
  //console.log("Content Creator Request", response.data.jwt)
});
//Content Creator Tests

test('content creator can login', async () => {
  const response = await publicRequest.post('/auth/local', {
    identifier: 'defaultcontentcreator',
    password: '123456',
  });

  expect(response.status).toBe(200);
  expect(response.data).toHaveProperty('jwt');
  expect(response.data).toHaveProperty('user');
});

test('content creator can create units', async () => {
  const response = await contentcreatorRequest.post('/units', {
    name: 'UnitName',
    number: 123,
    teks_id: 'abc',
    teks_description: 'my description',
    grade: 5,
  });
  expect(response.status).toBe(200);

  //reverting for async tests
  const responseDelete = await contentcreatorRequest.delete(
    '/units/' + response.data.id
  );
  expect(responseDelete.status).toBe(200);
});

test('content creator can edit units', async () => {
  const response = await contentcreatorRequest.put(`/units/1`, {
    //changed the unitID to be what is preloaded already
    grade: 1,
    number: 234,
    teks_id: 'afagageyge',
    teks_description: 'New description',
    name: 'NewUnitName',
  });
  expect(response.status).toBe(200);

  //Reverting it back to what it was for async tests
  const responseRevert = await contentcreatorRequest.put(`/units/1`, {
    //changed the unitID to be what is preloaded already
    name: 'Matter and Energy',
    number: 1,
    teks_id: '5.5A',
    teks_description:
      'Students will be able to classify matter based on physical properties, including mass, magnetism, physical state (solid, liquid, and gas), relative density (sinking and floating), solubility in water, and the ability to conduct or insulate thermal energy or electrical energy.',
    grade: 4,
  });
  expect(responseRevert.status).toBe(200);
});

test('content creator can create and delete learning standard', async () => {
  const response = await contentcreatorRequest.post('/learning-standards', {
    name: 'myLS',
    unit: 1,
    number: 133,
    teks: '2bsbdA',
    expectations:
      'Test expecation description so defaultcontentcreator doesnt error out',
  });
  expect(response.status).toBe(200);

  const deleteResponse = await contentcreatorRequest.delete(
    `/learning-standards/${response.data.id}`
  );
  expect(deleteResponse.status).toBe(200);
});

test('content creator can edit learning Standards', async () => {
  const response = await contentcreatorRequest.put(`/learning-standards/1`, {
    //changed learned standard to be what is alread preloaded
    name: 'NewLearningStandard',
    unit: 1,
    number: 0,
    teks: '2B',
    expectations: 'cc can edit ls',
  });
  expect(response.status).toBe(200);

  //reverting it back to what it was - for async tests
  const responseRevert = await contentcreatorRequest.put(
    `/learning-standards/1`,
    {
      name: 'Mixtures and Solutions',
      unit: 1,
      number: 1.3,
      teks: 'gaekgoiu',
      expectations:
        'Demonstrate that some mixtures maintain physical properties of their ingredients such as iron fillings and sand and sand and water.Identify changes that can occur in the physical properties of the ingredients or solutions such as dissolving salt in water or adding lemon juice to water.',
    }
  );
  expect(responseRevert.status).toBe(200);
});

//just modified the learning_standard to be hardcoded to the data that is preloaded into the database
test('content creator can create days', async () => {
  const response = await contentcreatorRequest.post('/days', {
    number: 123,
    learning_standard: 1,
    template:
      '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="io_digitalwrite" id="j#m#H23NIQH5Wz^I2c^G" x="70" y="224"><field name="PIN">0</field><value name="STATE"><block type="io_highlow" id="7.^n|ek_3R;_Q`K9M!;/"><field name="STATE">HIGH</field></block></value></block></xml>',
  });
  expect(response.status).toBe(200);

  //reverting for async
  const responseDelete = await contentcreatorRequest.delete(
    '/days/' + response.data.id
  );
  expect(responseDelete.status).toBe(200);
});
