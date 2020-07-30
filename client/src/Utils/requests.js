import {cms, compile} from './hosts'
import axios from 'axios'

const GET = 'GET';
const PUT = 'PUT';
const POST = 'POST';

// all request functions should utilize makeRequest and return an obj with structure {data, err}
const makeRequest = async (method, path, data, config, error) => {
    let res = null;
    let err = null;
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
                throw Error
        }
    } catch {
        err = error ? error : "An error occurred."
    }

    return {data: res, err: err}
};

export const getDayToolboxAll = async () => (
    makeRequest(GET,
        `${cms}/sandbox/toolbox`,
        null,
        null,
        "Toolbox could not be retrieved.")
);

export const getDayToolbox = async (id, jwt) => (
    makeRequest(GET,
        `${cms}/days/toolbox/${id}`,
        null,
        {
            headers: {
                Authorization:
                    `Bearer ${jwt}`
            }
        },
        "Toolbox could not be retrieved.")
);

export const getMentor = async (jwt) => (
    makeRequest(GET,
        `${cms}/classroom-managers/me`,
        null,
        {
            headers: {
                Authorization:
                    `Bearer ${jwt}`
            }
        },
        "Your classroom manager information could not be retrieved.")
);

export const getClassroom = async (id, jwt) => (
    makeRequest(GET,
        `${cms}/classrooms/${id}`,
        null,
        {
            headers: {
                'Authorization':
                    `Bearer ${jwt}`
            }
        },
        "Classroom information could not be retrieved")
);

export const getStudentClassroom = async (jwt) => (
    makeRequest(GET,
        `${cms}/classrooms/student`,
        null,
        {
            headers: {
                'Authorization':
                    `Bearer ${jwt}`
            }
        },
        "Classroom information could not be retrieved")
);

export const getClassrooms = async (ids, jwt) => (Promise.all(ids.map(async id => (await getClassroom(id, jwt)).data)))

export const getStudents = async (code) => (
    makeRequest(GET,
        `${cms}/classrooms/join/${code}`,
        null,
        null,
        "Student info could not be retrieved.")
);

export const postJoin = async (code, ids) => (
    makeRequest(POST,
        `${cms}/classrooms/join/${code}`,
        {
            "students": ids,
        },
        null,
        "Login failed.")
);

export const compileCode = async (body) => (
    makeRequest(POST,
        `${compile}/compile`,
        body,
        null,
        "Compilation failed.")
);

export const setEnrollmentStatus = async (id, enrolled, jwt) => (
    makeRequest(PUT,
        `${cms}/students/enrolled/${id}`,
        {
            "enrolled": enrolled
        },
        {
            headers: {
                'Authorization':
                    `Bearer ${jwt}`
            }
        },
        "Failed to change enrollment status.")
);

export const updateStudent = async (id, student, jwt) => (
    makeRequest(PUT,
        `${cms}/students/${id}`,
        student,
        {
            headers: {
                'Authorization':
                    `Bearer ${jwt}`
            }
        },
        "Failed to update student.")
);

export const getUnits = async (id, jwt) => (
    makeRequest(GET,
        `${cms}/units?grade=${id}`,
        null,
        {
            headers: {
                'Authorization':
                    `Bearer ${jwt}`
            }
        },
        "Failed to retrieve units.")
);

export const getLearningStandard = async (id, jwt) => (
    makeRequest(GET,
        `${cms}/learning-standards/${id}`,
        null,
        {
            headers: {
                'Authorization':
                    `Bearer ${jwt}`
            }
        },
        "Failed to retrieve learning standard.")
);

export const setSelection = async (classroom, learningStandard, jwt) => (
    makeRequest(POST,
        `${cms}/selections/`,
        {
            classroom: classroom,
            learning_standard: learningStandard
        },
        {
            headers: {
                'Authorization':
                    `Bearer ${jwt}`
            }
        },
        "Failed to set active learning standard.")
);
