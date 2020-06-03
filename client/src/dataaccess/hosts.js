import development from '../config/development.json'
import staging from '../config/staging.json'
import production from '../config/production.json'

const getHosts = () => {
    const { hostname } = window.location

    if (hostname.includes('localhost')) return development
    if (hostname.includes('staging')) return staging
    return production
}

export const cms = getHosts().cms
export const compile = getHosts().compile
