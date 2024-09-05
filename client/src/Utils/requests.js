import { server } from './hosts';
import axios from 'axios';
import { getToken } from './AuthRequests';

const GET = 'GET';
const PUT = 'PUT';
const POST = 'POST';
const DELETE = 'DELETE';

// all request functions should utilize makeRequest and return an obj with structure {data, err}
const makeRequest = async ({ method, path, data, auth = false, error }) => {
  let res = null;
  let err = null;
  const config = auth
    ? {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    : null;

  try {
    switch (method) {
      case GET:
        res = (await axios.get(path, config)).data;
        break;
      case POST:
        res = (await axios.post(path, data, config)).data;
        break;
      case PUT:
        res = (await axios.put(path, data, config)).data;
        break;
      case DELETE:
        res = (await axios.delete(path, config)).data;
        break;
      default:
        throw Error('Invalid method.');
    }
  } catch (e) {
    console.error(e);
    err = error ? error : 'An error occurred.';
  }

  return { data: res, err: err };
};

export const getDays = async () =>
  makeRequest({
    method: GET,
    path: `${server}/days`,
    auth: true,
    error: 'Days could not be retrieved.',
  });

export const getTeachers = async () =>
  makeRequest({
    method: GET,
    path: `${server}/mentors`,
    auth: true,
    error: 'Teachers could not be retrieved.',
  });

export const getAllClassrooms = async () =>
  makeRequest({
    method: GET,
    path: `${server}/classrooms`,
    auth: true,
    error: 'Classrooms could not be retrieved.',
  });

export const getAllStudents = async () =>
  makeRequest({
    method: GET,
    path: `${server}/students`,
    auth: true,
    error: 'Students could not be retrieved.',
  });

export const getDayToolboxAll = async () =>
  makeRequest({
    method: GET,
    path: `${server}/sandbox/toolbox`,
    error: 'Toolbox could not be retrieved.',
  });

// export cost getDayActivities = async () =>
//   makeRequest({
//     method: GET,
//     path: `${server}/days/`
//   })

// export const getLearningStandardDays = async (lsId) =>
//   makeRequest({
//     method: GET,
//     path: `${server}/days?learning_standard.id=${lsId}`,
//     auth: true,
//     error: 'Day cannot be retrived',
//   });
export const getDayToolbox = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/days/toolbox/${id}`,
    auth: true,
    error: 'Toolbox could not be retrieved.',
  });

export const getMentor = async () =>
  makeRequest({
    method: GET,
    path: `${server}/classroom-managers/me`,
    auth: true,
    error: 'Your classroom manager information could not be retrieved.',
  });

export const getClassroom = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/classrooms/${id}`,
    auth: true,
    error: 'Classroom information could not be retrieved',
  });

export const getStudentClassroom = async () =>
  makeRequest({
    method: GET,
    path: `${server}/classrooms/student`,
    auth: true,
    error: 'Classroom information could not be retrieved',
  });

export const getClassrooms = async (ids) =>
  Promise.all(ids.map(async (id) => (await getClassroom(id)).data));

export const getStudents = async (code) =>
  makeRequest({
    method: GET,
    path: `${server}/classrooms/join/${code}`,
    error: 'Student info could not be retrieved.',
  });

export const getStudent = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/students/${id}`,
    auth: true,
    error: 'Student info could not be retrieved.',
  });

export const postJoin = async (code, ids) =>
  makeRequest({
    method: POST,
    path: `${server}/classrooms/join/${code}`,
    data: {
      students: ids,
    },
    error: 'Login failed.',
  });

export const createDay = async (day, learningStandard) =>
  makeRequest({
    method: POST,
    path: `${server}/days`,
    data: {
      learning_standard: learningStandard,
      number: day,
      template: '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>)',
    },
    auth: true,
    error: 'Login failed.',
  });

export const setEnrollmentStatus = async (id, enrolled) =>
  makeRequest({
    method: PUT,
    path: `${server}/students/enrolled/${id}`,
    data: {
      enrolled: enrolled,
    },
    auth: true,
    error: 'Failed to change enrollment status.',
  });

export const updateStudent = async (id, student) =>
  makeRequest({
    method: PUT,
    path: `${server}/students/${id}`,
    data: student,
    auth: true,
    error: 'Failed to update student.',
  });

export const getUnits = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/units?grade=${id}`,
    auth: true,
    error: 'Failed to retrieve units.',
  });

export const getLearningStandard = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/learning-standards/${id}`,
    auth: true,
    error: 'Failed to retrieve learning standard.',
  });

export const getUnit = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/units/${id}`,
    auth: true,
    error: 'Failed to retrieve learning standard.',
  });

export const getAllUnits = async () =>
  makeRequest({
    method: GET,
    path: `${server}/units`,
    auth: true,
    error: 'Failed to retrieve learning standard.',
  });

export const getLearningStandardcount = async () =>
  makeRequest({
    method: GET,
    path: `${server}/learning-standards/count`,
    auth: true,
    error: 'Failed to retrieve learning standard.',
  });

export const getLearningStandardAll = async () =>
  makeRequest({
    method: GET,
    path: `${server}/learning-standards?_sort=unit.name:ASC,name:ASC`,
    auth: true,
    error: 'Failed to retrieve learning standard.',
  });

export const setSelection = async (classroom, learningStandard) =>
  makeRequest({
    method: POST,
    path: `${server}/selections/`,
    data: {
      classroom: classroom,
      learning_standard: learningStandard,
    },
    auth: true,
    error: 'Failed to set active learning standard.',
  });

export const saveWorkspace = async (day, workspace, replay) =>
  makeRequest({
    method: POST,
    path: `${server}/saves`,
    data: {
      day,
      workspace,
      replay,
    },
    auth: true,
    error: 'Failed to save your workspace.',
  });

export const getSaves = async (day) =>
  makeRequest({
    method: GET,
    path: `${server}/saves/day/${day}`,
    auth: true,
    error: 'Past saves could not be retrieved.',
  });

export const getSave = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/saves/${id}`,
    auth: true,
    error: 'Save could not be retrieved.',
  });

export const createSubmission = async (id, workspace, sketch, path, isAuth) =>
  makeRequest({
    method: POST,
    path: `${server}${path}`,
    data: {
      day: id,
      workspace: workspace,
      board: 'arduino:avr:uno',
      sketch: sketch,
    },
    auth: isAuth,
    error: 'Failed to create submission.',
  });

export const getSubmission = async (submissionId, path, isAuth) =>
  makeRequest({
    method: GET,
    path: `${server}${path}/${submissionId}`,
    auth: isAuth,
    error: 'Failed to retrieve submission status',
  });

export const addStudent = async (name, character, classroom) =>
  makeRequest({
    method: POST,
    path: `${server}/students`,
    data: {
      name: name,
      character: character,
      classroom: classroom,
    },
    auth: true,
    error: 'Failed to add student.',
  });

export const addStudents = async (students, classroom) =>
  makeRequest({
    method: POST,
    path: `${server}/students`,
    data: { students: students, classroom: classroom },
    auth: true,
    error: 'Failed to add students.',
  });

export const deleteStudent = async (student) =>
  makeRequest({
    method: DELETE,
    path: `${server}/students/${student}`,
    auth: true,
    error: 'Failed to delete student.',
  });

export const updateDayTemplate = async (id, workspace, blocksList) =>
  makeRequest({
    method: PUT,
    path: `${server}/days/template/${id}`,
    data: {
      template: workspace,
      blocks: blocksList,
    },
    auth: true,
    error: 'Failed to update the template for the day',
  });

export const updateActivityTemplate = async (id, workspace) =>
  makeRequest({
    method: PUT,
    path: `${server}/days/activity_template/${id}`,
    data: {
      activity_template: workspace,
      //blocks: blocksList,
    },
    auth: true,
    error: 'Failed to update the activity template for the day',
  });

export const deleteDay = async (id) =>
  makeRequest({
    method: DELETE,
    path: `${server}/days/${id}`,
    auth: true,
    error: 'Failed to delete day.',
  });

export const deleteLearningStandard = async (id) =>
  makeRequest({
    method: DELETE,
    path: `${server}/learning-standards/${id}`,
    auth: true,
    error: 'Failed to delete student.',
  });

export const createLearningStandard = async (
  description,
  name,
  number,
  unit,
  teks,
  link
) =>
  makeRequest({
    method: POST,
    path: `${server}/learning-standards`,
    data: {
      expectations: description,
      name,
      number,
      unit,
      teks,
      link,
    },
    auth: true,
    error: 'Login failed.',
  });

export const createUnit = async (number, name, teksID, teksDescrip, grade) =>
  makeRequest({
    method: POST,
    path: `${server}/units`,
    data: {
      number: parseInt(number, 10),
      name: name,
      grade: parseInt(grade, 10),
      teks_id: teksID,
      teks_description: teksDescrip,
    },
    auth: true,
    error: 'Fail to create new unit.',
  });

export const updateUnit = async (
  id,
  number,
  name,
  teksID,
  teksDescrip,
  grade
) =>
  makeRequest({
    method: PUT,
    path: `${server}/units/${id}`,
    data: {
      number: parseInt(number, 10),
      name: name,
      grade: parseInt(grade, 10),
      teks_id: teksID,
      teks_description: teksDescrip,
    },
    auth: true,
    error: 'Failed to update unit',
  });

export const getGrades = async () =>
  makeRequest({
    method: GET,
    path: `${server}/grades`,
    auth: true,
    error: 'Grades could not be retrieved',
  });

export const getGrade = async (grade) =>
  makeRequest({
    method: GET,
    path: `${server}/grades/${grade}`,
    auth: true,
    error: 'Grade could not be retrieved',
  });

export const updateLearningStandard = async (
  id,
  name,
  expectations,
  teks,
  link
) =>
  makeRequest({
    method: PUT,
    path: `${server}/learning-standards/${id}`,
    data: {
      name,
      teks,
      expectations,
      link,
    },
    auth: true,
    error: 'Failed to update unit',
  });

export const updateDayDetails = async (
  id,
  description,
  // template,
  // activity_template,
  TekS,
  images,
  link,
  scienceComponents,
  makingComponents,
  computationComponents
) =>
  makeRequest({
    method: PUT,
    path: `${server}/days/${id}`,
    data: {
      description,
      //template,
      //activity_template,
      TekS,
      images,
      link,
      scienceComponents,
      makingComponents,
      computationComponents,
    },
    auth: true,
    error: 'Failed to update unit',
  });

export const getLearningStandardDays = async (lsId) =>
  makeRequest({
    method: GET,
    path: `${server}/days?learning_standard.id=${lsId}`,
    auth: true,
    error: 'Day cannot be retrived',
  });

  export const getDayActivities = async (lsId) =>
  makeRequest({
    method: GET,
    path: `${server}/cc-workspaces?days.id=${lsId}`,
    auth: true,
    error: 'Activities cannot be retrieved',
  });

export const getDay = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/days/${id}`,
    auth: true,
    error: 'Day cannot be retrived',
  });

export const forgetPassword = async (email) =>
  makeRequest({
    method: POST,
    path: `${server}/auth/forgot-password`,
    data: {
      email,
    },
    error: 'cannot retrive data from the provided email',
  });

export const sendEmailConfirmationEmail = async(email, super_email) =>
  makeRequest({
    method:POST,
    path: `${server}/auth/send-email-confirmation`,
    data: {
      email,
      super_email
    },
    error: "Error sending confirmation email"
  });

export const confirmEmail = async(confirmation) => 
  makeRequest({
    method: GET,
    path: `${server}/auth/email-confirmation?confirmation=${confirmation}`,
    error: 'Error confirming user'
  });

export const resetPassword = async (code, password, passwordConfirmation) =>
  makeRequest({
    method: POST,
    path: `${server}/auth/reset-password`,
    data: {
      code,
      password,
      passwordConfirmation,
    },
    error:
      'Cannot update new password. Please try again or get a new link from the forgot password page.',
  });

export const getSessions = async () =>
  makeRequest({
    method: GET,
    path: `${server}/sessions`,
    auth: true,
    error: 'Sessions could not be retrieved.',
  });

export const updateSessionArduino = async(id, arduino) =>
  makeRequest({
    method: PUT,
    path: `${server}/sessions/arduino/${id}`,
    data: {
      arduino
    },
    auth: true,
    error: 'stuff did not work lol'
  });

  export const updateDayArduino = async(id, arduino) =>
    makeRequest({
      method: PUT,
      path: `${server}/days/arduino/${id}`,
      data: {
        arduino
      },
      auth: true,
      error: 'stuff did not work lol'
    });

export const getSessionsWithFilter = async (filterOptions) =>
  makeRequest({
    method: GET,
    path: `${server}/sessions?${filterOptions}`,
    auth: true,
    error: 'Sessions could not be retrieved.',
  });

export const getSessionCount = async () =>
  makeRequest({
    method: GET,
    path: `${server}/sessions/count`,
    auth: true,
    error: 'Session count could not be retrieved.',
  });

export const getSessionCountWithFilter = async (filterOptions) =>
  makeRequest({
    method: GET,
    path: `${server}/sessions/count?${filterOptions}`,
    auth: true,
    error: 'Session count could not be retrieved.',
  });

export const getSession = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/sessions/${id}`,
    auth: true,
    error: 'Sessions could not be retrieved.',
  });
export const submitBugReport = async (
  description,
  steps,
  name,
  email,
  systemInfo
) =>
  makeRequest({
    method: POST,
    path: `${server}/bug-report`,
    data: {
      description,
      steps,
      name,
      email,
      systemInfo,
    },
    error: 'Unable to submit bug-report',
  });

export const getCCWorkspaces = async () =>
  makeRequest({
    method: GET,
    path: `${server}/cc-workspaces`,
    auth: true,
    error: 'Unable to retrive cc worksapces',
  });

export const getCCWorkspace = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/cc-workspaces/${id}`,
    auth: true,
    error: 'Unable to retrive cc workspace',
  });

export const createCCWorkspace = async (
  name,
  description,
  template,
  blocks,
  classroomId
) =>
  makeRequest({
    method: POST,
    path: `${server}/cc-workspaces`,
    auth: true,
    data: {
      name,
      description,
      template,
      blocks,
      classroomId,
    },
    error: 'Unable to create cc workspace',
  });
export const getCCWorkspaceToolbox = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/cc-workspaces/toolbox/${id}`,
    auth: true,
    error: 'Toolbox could not be retrieved.',
  });

export const updateCCWorkspace = async (id, template, blocks) =>
  makeRequest({
    method: PUT,
    path: `${server}/cc-workspaces/${id}`,
    auth: true,
    data: {
      template,
      blocks,
    },
    error: 'Unable to create cc workspace',
  });
export const deleteCCWorkspace = async (id) =>
  makeRequest({
    method: DELETE,
    path: `${server}/cc-workspaces/${id}`,
    auth: true,
    error: 'Unable to delete cc workspace',
  });

export const getClassroomWorkspace = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/classroom/workspaces/${id}`,
    auth: true,
    error: 'Unable to retrive classroom workspaces',
  });

export const CreateAccount = async (username, email, password, role) =>
  makeRequest({
    method: POST,
    path: `${server}/users`,
    auth: true,
    error: 'Unable to create new account',
    data: {
      username,
      email,
      password,
      role
    }
  })

export const createMentor = async (user, firstName, lastName, schoolID, classroomID) =>
  makeRequest({
    method: POST,
    path: `${server}/mentors`,
    auth: true,
    error: 'Unabled to create new mentor',
    data: {
      user: user,
      first_name: firstName,
      last_name: lastName,
      school: schoolID,
      classrooms: {id:classroomID}
      
    }
  })

export const addMentorClass = async (userID, classrooms, 
  created_at, first_name, id, last_name, school) =>
  makeRequest({
    method: PUT,
    path: `${server}/mentors/${userID}`,
    auth: true,
    error: "unable to add mentor to classroom",
    data: {
      classrooms,
      created_at,
      first_name,
      id,
      last_name,
      school
    }

  });

export const getSchoolList = async() =>
  makeRequest({
    method: GET,
    path: `${server}/schools`,
    auth: true
  })

  export const updateClassroom = async(id, formcode) => 
      makeRequest({
        method: PUT,
        path: `${server}/classrooms/${id}`,
        auth: true,
        data: {
          form: formcode
        }
      })