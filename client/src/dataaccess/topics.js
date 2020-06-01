import { get } from './methods'
import { cms } from '../hosts'

export const getTopics = () => get(`${cms}/topics`)