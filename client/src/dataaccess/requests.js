import { get, post } from './methods'
import { cms, compile } from '../hosts'

export const getTopics = () => get(`${cms}/topics`)
export const getActivityToolbox = (id) => get(`${cms}/activities/toolbox/${id}`)
export const compileCode = (body) => post(`${compile}/compile`, body)