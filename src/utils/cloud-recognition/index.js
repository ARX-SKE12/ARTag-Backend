import { EASYAR_APP_KEY, EASYAR_HOST, EASYAR_SECRET } from 'utils/cloud-recognition/constants'

import Request from 'request-promise'
import SHA1 from 'sha1'

function generateSignature(data) {
    const concat = `${Object.keys(data).sort().map(key => `${key}${data[key]}`).join('')}${EASYAR_SECRET}`
    return SHA1(concat)
}

function generateRequiredData(data) {
    data.appKey = EASYAR_APP_KEY
    data.date = new Date().toISOString()
    data.signature = generateSignature(data)
    return data
}

export function similar(image) {
    const data = generateRequiredData({ image })
    return Request({
        method: 'POST',
        uri: `${EASYAR_HOST}/similar/`,
        headers: {
            'content-type': 'application/json'
        },
        body: data,
        json: true
    }).then(response => {
        if (response.error) throw 'Invalid Data'
        else return response.result.results.length !== 0
    }).catch(err => err)
}

export function canTrack(image) {
    const data = generateRequiredData({ image })
    return Request({
        method: 'POST',
        uri: `${EASYAR_HOST}/grade/detection/`,
        headers: {
            'content-type': 'application/json'
        },
        body: data,
        json: true
    }).then(response => {
        if (response.error) throw 'Invalid Data'
        else return response.result.grade <= 3
    }).catch(err => err)
}

export function createTarget(name, image, size) {
    const data = generateRequiredData({ image, name, size: size.toString(), type: 'ImageTarget', meta: "" })
    return Request({
        method: 'POST',
        uri: `${EASYAR_HOST}/targets/`,
        headers: {
            'content-type': 'application/json'
        },
        body: data,
        json: true
    }).then(response => {
        if (response.error) throw 'Invalid Data'
        else return response.result.targetId
    }).catch(err => err)
}
