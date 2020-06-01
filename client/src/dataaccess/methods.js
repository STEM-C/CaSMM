import axios from 'axios'

export const get = async (path) => (await axios.get(path)).data

export const post = async (path, body) => (await axios.post(path, body)).data

// other HTTP method implementations