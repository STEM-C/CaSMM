'use strict'

import axios from 'axios'
//import { get } from 'k6/http'
//axios.defaults.adapter = require('axios/lib/adapters/http');
const host = 'http://localhost:1337/api'

export const getToken = () => {
    return sessionStorage.getItem('token') || null;
}

const GET = 'GET';
const PUT = 'PUT';
const POST = 'POST';
const DELETE = 'DELETE'

const makeRequest = async ( {method, path, data, auth = false, error}) => {
    let res = null;
    let err = null;
    const config = auth ? {
        headers: {
            Authorization:
                `Bearer ${token}` 
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

export const getPublicRequestModule = () => axios.create({
    baseURL: host
})

export const getAuthorizedRequestModule = (token) => axios.create({
    baseURL: host,
    headers: { 
        Authorization: `Bearer ${token}`
    }
})

export const getStudentLoginData = async () => (
    makeRequest({
        method: 'GET',
        path: `${host}/classrooms/join/0450`,
        auth: true,
        error: "Student login data information could not be retrieved",
    })
)

export const getMentorLoginData = async (token) => (
makeRequest({
    method: 'GET',
    path: `${host}/classrooms/1`,
    auth: true,
    error: "Mentor login data information could not be retrieved",
    token: token
    })
)

export const getStudents = async (code) => (
    makeRequest({
        method: 'GET',
        path: `${host}/classrooms/join/${code}`,
        error: "Student info could not be retrieved.",
    })
)

export const postJoin = async (code, ids) => (
    makeRequest({
        method: POST,
        path: `${host}/classrooms/join/${code}`,
        data: {
            "students": ids,
        },
        error: "Login failed.",
    })
);

export const getStudentClassroom = async () => (
    makeRequest({
        method: 'GET',
        path: `${host}/classrooms/student`,
        auth: true,
        error: "Classroom information could not be retrieved",
    })
);