import {cms, compile} from './hosts'
import axios from 'axios'


export const getTopics = async (jwt) => (await axios.get(`${cms}/topics`, {
    headers: {
        Authorization:
            `Bearer ${jwt}`
    }
})).data

export const getActivityToolboxAll = async () => (await axios.get(`${cms}/sandbox/toolbox`)).data

export const getActivityToolbox = async (id, jwt) => (await axios.get(`${cms}/activities/toolbox/${id}`, {
    headers: {
        Authorization:
            `Bearer ${jwt}`
    }
})).data

export const getMentor = async (jwt) => (await axios.get(`${cms}/mentors/me`, {
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

export const getClassrooms = async (ids, jwt) => ( Promise.all(ids.map( id => getClassroom(id,jwt) )))

export const getActivities = async (jwt) => (await axios.get(`${cms}/sessions/student/activities`, {
    headers: {
        'Authorization':
            `Bearer ${jwt}`
    }
})).data

export const getStudents = async (code) => (await axios.get(`${cms}/sessions/code/${code}`)).data

export const postJoin = async (code, ids) => (await axios.post(`${cms}/sessions/join`, {
        "students": ids,
        "code": code
    }
)).data

export const compileCode = async (body) => (await axios.post(`${compile}/compile`, body)).data

export const updateSession = async (id, session, jwt) => (await axios.put(`${cms}/sessions/${id}`, session,
    {
        headers: {
            'Authorization':
                `Bearer ${jwt}`
        }
    }
)).data
