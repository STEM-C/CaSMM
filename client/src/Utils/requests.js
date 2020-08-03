import {cms, compile} from './hosts'
import axios from 'axios'
import {getToken} from "./AuthRequests";

const GET = 'GET';
const PUT = 'PUT';
const POST = 'POST';

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
        path: `${cms}/sandbox/toolbox`,
        error: "Toolbox could not be retrieved."
    })
);

export const getDayToolbox = async (id) => (
    makeRequest({
        method: GET,
        path: `${cms}/days/toolbox/${id}`,
        auth: true,
        error: "Toolbox could not be retrieved."
    })
);

export const getMentor = async () => (
    makeRequest({
        method: GET,
        path: `${cms}/classroom-managers/me`,
        auth: true,
        error: "Your classroom manager information could not be retrieved."
    })
);

export const getClassroom = async (id) => (
    makeRequest({
        method: GET,
        path: `${cms}/classrooms/${id}`,
        auth: true,
        error: "Classroom information could not be retrieved"
    })
);

export const getStudentClassroom = async () => (
    makeRequest({
        method: GET,
        path: `${cms}/classrooms/student`,
        auth: true,
        error: "Classroom information could not be retrieved"
    })
);

export const getClassrooms = async (ids) => (Promise.all(ids.map(async id => (await getClassroom(id)).data)));

export const getStudents = async (code) => (
    makeRequest({
        method: GET,
        path: `${cms}/classrooms/join/${code}`,
        error: "Student info could not be retrieved."
    })
);

export const postJoin = async (code, ids) => (
    makeRequest({
        method: POST,
        path: `${cms}/classrooms/join/${code}`,
        data: {
            "students": ids,
        },
        error: "Login failed."
    })
);

export const compileCode = async (body) => (
    makeRequest({
        method: POST,
        path: `${compile}/compile`,
        data: body,
        error: "Compilation failed."
    })
);

export const setEnrollmentStatus = async (id, enrolled) => (
    makeRequest({
        method: PUT,
        path: `${cms}/students/enrolled/${id}`,
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
        path: `${cms}/students/${id}`,
        data: student,
        auth: true,
        error: "Failed to update student."
    })
);

export const getUnits = async (id) => (
    makeRequest({
        method: GET,
        path: `${cms}/units?grade=${id}`,
        auth: true,
        error: "Failed to retrieve units."
    })
);

export const getLearningStandard = async (id) => (
    makeRequest({
        method: GET,
        path: `${cms}/learning-standards/${id}`,
        auth: true,
        error: "Failed to retrieve learning standard."
    })
);

export const setSelection = async (classroom, learningStandard) => (
    makeRequest({
        method: POST,
        path: `${cms}/selections/`,
        data: {
            classroom: classroom,
            learning_standard: learningStandard
        },
        auth: true,
        error: "Failed to set active learning standard."
    })
);
