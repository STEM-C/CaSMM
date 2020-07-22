'use strict'

import axios from 'axios'
const host = 'http://localhost:1337'

export const getPublicRequestModule = () => axios.create({
    baseURL: host
})

export const getAuthorizedRequestModule = (token) => axios.create({
    baseURL: host,
    headers: { 
        Authorization: `Bearer ${token}`
    }
})