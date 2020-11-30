import {server} from './hosts'
import axios from 'axios'
import {getToken} from "./AuthRequests";

const GET = 'GET';
const PUT = 'PUT';
const POST = 'POST';
const DELETE = 'DELETE'

// all request functions should utilize makeRequest and return an obj with structure {data, err}
const makeRequest = async ({method, path, data, auth = false, error}) => {
    let res = null;
    let err = null;
    const config = auth ? {
        headers: {
            Authorization:
                `Bearer ${getToken()}`
        }
    } : null;

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
                throw Error('Invalid method.')
        }
    } catch (e) {
        console.error(e);
        err = error ? error : "An error occurred."
    }

    return {data: res, err: err}
};

export const getDayToolboxAll = async () => (
    makeRequest({
        method: GET,
        path: `${server}/sandbox/toolbox`,
        error: "Toolbox could not be retrieved."
    })
);

export const getDayToolbox = async (id) => (
    makeRequest({
        method: GET,
        path: `${server}/days/toolbox/${id}`,
        auth: true,
        error: "Toolbox could not be retrieved."
    })
);

export const getMentor = async () => (
    makeRequest({
        method: GET,
        path: `${server}/classroom-managers/me`,
        auth: true,
        error: "Your classroom manager information could not be retrieved."
    })
);

export const getClassroom = async (id) => (
    makeRequest({
        method: GET,
        path: `${server}/classrooms/${id}`,
        auth: true,
        error: "Classroom information could not be retrieved"
    })
);

export const getStudentClassroom = async () => (
    makeRequest({
        method: GET,
        path: `${server}/classrooms/student`,
        auth: true,
        error: "Classroom information could not be retrieved"
    })
);

export const getClassrooms = async (ids) => (Promise.all(ids.map(async id => (await getClassroom(id)).data)));

export const getStudents = async (code) => (
    makeRequest({
        method: GET,
        path: `${server}/classrooms/join/${code}`,
        error: "Student info could not be retrieved."
    })
);

export const postJoin = async (code, ids) => (
    makeRequest({
        method: POST,
        path: `${server}/classrooms/join/${code}`,
        data: {
            "students": ids,
        },
        error: "Login failed."
    })
);

export const createDay = async (day,learningStandard) =>(
    makeRequest({
        method: POST,
        path: `${server}/days`,
        data: {
            "learning_standard": learningStandard,
            "number": day,
            "template": '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>)',
        },
        auth: true,
        error: "Login failed."
    })
);

export const setEnrollmentStatus = async (id, enrolled) => (
    makeRequest({
        method: PUT,
        path: `${server}/students/enrolled/${id}`,
        data: {
            "enrolled": enrolled
        },
        auth: true,
        error: "Failed to change enrollment status."
    })
);

export const updateStudent = async (id, student) => (
    makeRequest({
        method: PUT,
        path: `${server}/students/${id}`,
        data: student,
        auth: true,
        error: "Failed to update student."
    })
);

export const getUnits = async (id) => (
    makeRequest({
        method: GET,
        path: `${server}/units?grade=${id}`,
        auth: true,
        error: "Failed to retrieve units."
    })
);

export const getLearningStandard = async (id) => (
    makeRequest({
        method: GET,
        path: `${server}/learning-standards/${id}`,
        auth: true,
        error: "Failed to retrieve learning standard."
    })
);

export const getUnit = async(id)=>(
    makeRequest({
        method: GET,
        path: `${server}/units/${id}`,
        auth: true,
        error: "Failed to retrieve learning standard."
    })
)


export const getAllUnits = async()=>(
    makeRequest({
        method: GET,
        path: `${server}/units`,
        auth: true,
        error: "Failed to retrieve learning standard."
    })
)

export const getLearningStandardcount = async () => (
    makeRequest({
        method: GET,
        path: `${server}/learning-standards/count`,
        auth: true,
        error: "Failed to retrieve learning standard."
    })
);

export const getLearningStandardAll = async () => (
    makeRequest({
        method: GET,
        path: `${server}/learning-standards`,
        auth: true,
        error: "Failed to retrieve learning standard."
    })
);

export const setSelection = async (classroom, learningStandard) => (
    makeRequest({
        method: POST,
        path: `${server}/selections/`,
        data: {
            classroom: classroom,
            learning_standard: learningStandard
        },
        auth: true,
        error: "Failed to set active learning standard."
    })
);

export const saveWorkspace = async (day, workspace) => (
    makeRequest({
        method: POST,
        path: `${server}/saves`,
        data: {
            day: day,
            workspace: workspace
        },
        auth: true,
        error: 'Failed to save your workspace.'
    })
);

export const getSaves = async (day) => (
    makeRequest({
        method: GET,
        path: `${server}/saves/day/${day}`,
        auth: true,
        error: 'Past saves could not be retrieved.'
    })
);

export const createSubmission = async (day, workspace, sketch, path, isAuth) => (
    makeRequest({
        method: POST,
        path: `${server}${path}`,
        data: {
            day: day.id,
            workspace: workspace,
            board: "arduino:avr:uno",
            sketch: sketch
        },
        auth: isAuth,
        error: 'Failed to create submission.'
    })
);

export const getSubmission = async (submissionId, path, isAuth) => (
    makeRequest({
        method: GET,
        path: `${server}${path}/${submissionId}`,
        auth: isAuth,
        error: "Failed to retrieve submission status"
    })
)

export const addStudent = async (name, character, classroom) => (
    makeRequest({
        method: POST,
        path: `${server}/students`,
        data: {
            name: name,
            character: character,
            classroom: classroom
        },
        auth: true,
        error: 'Failed to add student.'
    })
);

export const addStudents = async (students, classroom) => (
    makeRequest({
        method: POST,
        path: `${server}/students`,
        data: {students: students, classroom: classroom},
        auth: true,
        error: 'Failed to add students.'
    })
);

export const deleteStudent = async (student) => (
    makeRequest({
        method: DELETE,
        path: `${server}/students/${student}`,
        auth: true,
        error: 'Failed to delete student.'
    })
);

export const updateDayTemplate = async (id, workspace) => (
    makeRequest({
        method: PUT,
        path: `${server}/days/${id}`,
        data: {template: workspace},
        auth: true,
        error: 'Failed to update Day'
    })
)

export const updateDay = async (id, workspace, blocksList) => (
    makeRequest({
        method: PUT,
        path: `${server}/days/${id}`,
        data: {
            "template": workspace,
            "blocks": blocksList
        },
        auth: true,
        error: 'Failed to update the toolbox for the day'
    })
)

export const deleteDay = async (id) => (
    makeRequest({
        method: DELETE,
        path: `${server}/days/${id}`,
        auth: true,
        error: 'Failed to delete day.'
    })
);

export const deleteLearningStandard = async (id) => (
    makeRequest({
        method: DELETE,
        path: `${server}/learning-standards/${id}`,
        auth: true,
        error: 'Failed to delete student.'
    })
);

export const createLearningStandard = async (description,name,number,unit) =>(
    makeRequest({
        method: POST,
        path: `${server}/learning-standards`,
        data: {
            "expectations": description,
            "name": name,
            "number": number,
            "unit": unit
        },
        auth: true,
        error: "Login failed."
    })
);

export const createUnit = async(number, name,teksID,teksDescrip,grade)=>(
    makeRequest({
        method: POST,
        path: `${server}/units`,
        data: {
            "number": parseInt(number, 10),
            "name": name,
            "grade": parseInt(grade, 10),
            "teks_id": teksID,
            "teks_description": teksDescrip,
        },
        auth: true,
        error: "Login failed."
    })
    
)
