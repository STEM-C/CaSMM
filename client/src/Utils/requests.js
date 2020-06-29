import {cms, compile} from './hosts'
import axios from 'axios'


export const getTopics = async (jwt) => (await axios.get(`${cms}/topics`, {
    headers: {
        Authorization:
            `Bearer ${jwt}`
    }
})).data

export const getActivityToolbox = async (id) => (await axios.get(`${cms}/activities/toolbox/${id}`)).data

export const getSchools = async (jwt) => (await axios.get(`${cms}/schools`, {
    headers: {
        Authorization:
            `Bearer ${jwt}`
    }
})).data

export const getClassrooms = async (id, jwt) => (await axios.get(`${cms}/classrooms?school=${id}`, {
    headers: {
        'Authorization':
            `Bearer ${jwt}`
    }
})).data

export const getActivities = async (jwt) => (await axios.get(`${cms}/sessions/student/activities`, {
    headers: {
        'Authorization':
            `Bearer ${jwt}`
    }
})).data

export const getStudents = async (code) => (await axios.get(`${cms}/sessions/code/${code}`)).data

export const postJoin = async (code, id) => (await axios.post(`${cms}/sessions/join`, {
        "studentId": id,
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
