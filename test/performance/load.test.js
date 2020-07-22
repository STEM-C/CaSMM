import http from 'k6/http'
import { sleep } from 'k6'

const host = 'http://localhost:1337'

export const options = {
  duration: '0.1m',
  vus: 50,
  thresholds: {
    http_req_duration: ['p(95)<2500'],
  },
}

export default function () {
  http.get(`${host}/topics`)
  sleep(1)
}