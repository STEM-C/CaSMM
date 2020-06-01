import { get } from './methods'
import { cms } from '../hosts'

export const getActivityToolbox = (id) => get(`${cms}/activities/toolbox/${id}`)