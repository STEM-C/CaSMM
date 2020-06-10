import http from 'k6/http'
import { sleep } from 'k6'

export const options = {
  duration: '1m',
  vus: 50,
  thresholds: {
    http_req_duration: ['p(95)<500'],
  },
}

export default function () {
  const res = http.get('https://stem-c-staging.herokuapp.com')
  const res2 = http.get('https://stem-c-staging.herokuapp.com/activities/toolbox/1')
  sleep(1)
}