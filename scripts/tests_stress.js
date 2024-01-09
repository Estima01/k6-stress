import http from 'k6/http'
import { check, sleep } from 'k6'
import { htmlReport } from './bundle.js'
import uuid from './uuid.js'

//testes de stress
// Parametros de execução
// 10 vus por 5 segundos
// 50 vus por 10 segundos
// 50 vus por 5 segundos
// 100 vus por 10 segundos
// 100 vus por 5 segundos
// 0 vus por 10 segundos
// falha de requisição de 1%


export function handleSummary(data) {
    return {
        'index.html': htmlReport(data),
    }
}

export const options = {
    stages: [
        {duration: '5s', target: 10,},
        {duration: '10s', target: 50,},
        {duration: '5s', target: 50,},
        {duration: '10s', target: 100,},
        {duration: '5s', target: 100,},
        {duration: '10s', target: 0,},
    ],
    
}

export default function () {
    const url = 'http://test-api.k6.io'

    const payload = JSON.stringify(
        {
            username: uuid.v4().substring(24),
            first_name: uuid.v4().substring(24),
            last_name: uuid.v4().substring(24),
            email: `${uuid.v4().substring(24)}@qa.estima.com.br`,
            password: `123456`,
        })
    
    const headers = {
        'headers': {
            'Content-Type': 'application/json'
        }
    }

    let res = http.post(url, payload, headers)
    check(res, {
        'is status 201': (r) => r.status === 201
    })
    sleep(1)
}