'use strict'

import axios from 'axios'
//axios.defaults.adapter = require('axios/lib/adapters/http');
const host = 'http://localhost:1337/api'

export const getPublicRequestModule = () => axios.create({
    baseURL: host
})

export const getAuthorizedRequestModule = (token) => axios.create({
    baseURL: host,
    headers: { 
        Authorization: `Bearer ${token}`
    }
})