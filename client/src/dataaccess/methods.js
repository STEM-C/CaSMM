import axios from 'axios'

export const get = async (path) => (await axios.get(path)).data

// other HTTP method implementations