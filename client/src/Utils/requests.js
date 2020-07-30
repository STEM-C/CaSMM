import {cms, compile} from './hosts'
import axios from 'axios'

export const getDayToolboxAll = async () => (await axios.get(`${cms}/sandbox/toolbox`)).data

export const getDayToolbox = async (id, jwt) => (await axios.get(`${cms}/days/toolbox/${id}`, {
    headers: {
        Authorization:
            `Bearer ${jwt}`
    }
})).data

export const getMentor = async (jwt) => (await axios.get(`${cms}/classroom-managers/me`, {
    headers: {
        Authorization:
            `Bearer ${jwt}`
    }
})).data

export const getClassroom = async (id, jwt) => (await axios.get(`${cms}/classrooms/${id}`, {
    headers: {
        'Authorization':
            `Bearer ${jwt}`
    }
})).data

export const getStudentClassroom = async (jwt) => (await axios.get(`${cms}/classrooms/student`, {
    headers: {
        'Authorization':
            `Bearer ${jwt}`
    }
})).data

export const getClassrooms = async (ids, jwt) => (Promise.all(ids.map(id => getClassroom(id, jwt))))

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
