import { cms, compile } from './hosts'
import axios from 'axios'


export const getTopics = async () => (await axios.get(`${cms}/topics`)).data

export const getActivityToolbox = async (id) => (await axios.get(`${cms}/activities/toolbox/${id}`)).data

export const compileCode = async (body) => (await axios.post(`${compile}/compile`, body)).data