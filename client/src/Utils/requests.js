import {cms, compile} from './hosts'
import axios from 'axios'

const GET = 'GET';
const PUT = 'PUT';
const POST = 'POST';

const makeRequest = async (method, path, config, error) => {
    let data = null;
    let err = null;
    try {
        switch (method) {
            case GET:
                data = (await axios.get(path, config)).data;
                break;
            case POST:
                data = (await axios.post(path, config)).data;
                break;
            case PUT:
                data = (await axios.put(path, config)).data;
                break;
            default:
                throw Error
        }
    } catch {
        err = error ? error : "An error occurred."
    }

    return {data: data, err: err}
};

export const getDayToolboxAll = async () => (
    makeRequest(GET, `${cms}/sandbox/toolbox`, null, "Could not retrieve toolbox.")
);

export const getDayToolbox = async (id, jwt) => (
    makeRequest(GET,
        `${cms}/days/toolbox/${id}`,
        {
            headers: {
                Authorization:
                    `Bearer ${jwt}`
            }
        },
        "Could not retrieve toolbox.")
);

export const getMentor = async (jwt) => (
    makeRequest(GET,
        `${cms}/classroom-managers/me`,
        {
            headers: {
                Authorization:
                    `Bearer ${jwt}`
            }
        },
        "Could not retrieve your classroom manager information.")
);

export const getClassroom = async (id, jwt) => (
    makeRequest(GET,
        `${cms}/classrooms/${id}`,
        {
            headers: {
                'Authorization':
                    `Bearer ${jwt}`
            }
        },
        "The classroom could not be retrieved")
);

export const getStudentClassroom = async (jwt) => (await axios.get(`${cms}/classrooms/student`, {
    headers: {
        'Authorization':
            `Bearer ${jwt}`
    }
})).data

export const getClassrooms = async (ids, jwt) => (Promise.all(ids.map(async id => (await getClassroom(id, jwt)).data)))

export const getStudents = async (code) => (await axios.get(`${cms}/classrooms/join/${code}`)).data

export const postJoin = async (code, ids) => (await axios.post(`${cms}/classrooms/join/${code}`, {
        "students": ids,
    }
)).data

export const compileCode = async (body) => (await axios.post(`${compile}/compile`, body)).data

export const setEnrollmentStatus = async (id, enrolled, jwt) => (await axios.put(`${cms}/students/enrolled/${id}`,
    {
        "enrolled": enrolled
    },
    {
        headers: {
            'Authorization':
                `Bearer ${jwt}`
        }
    }
)).data

export const updateStudent = async (id, student, jwt) => (await axios.put(`${cms}/students/${id}`, student,
    {
        headers: {
            'Authorization':
                `Bearer ${jwt}`
        }
    }
)).data

export const getUnits = async (id, jwt) => (await axios.get(`${cms}/units?grade=${id}`, {
    headers: {
        'Authorization':
            `Bearer ${jwt}`
    }
})).data

export const getLearningStandard = async (id, jwt) => (await axios.get(`${cms}/learning-standards/${id}`, {
    headers: {
        'Authorization':
            `Bearer ${jwt}`
    }
})).data

export const setSelection = async (classroom, learningStandard, jwt) => (await axios.post(`${cms}/selections/`,
    {
        classroom: classroom,
        learning_standard: learningStandard
    },
    {
        headers: {
            'Authorization':
                `Bearer ${jwt}`
        }
    }
)).data
