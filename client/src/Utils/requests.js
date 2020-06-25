import { cms, compile } from './hosts'
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
        Authorization:
            `Bearer ${jwt}`
    }
})).data

export const compileCode = async (body) => (await axios.post(`${compile}/compile`, body)).data