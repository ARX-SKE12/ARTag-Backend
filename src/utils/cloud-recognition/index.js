import { WIKITUDE_COLLECTION_API_ROOT, WIKITUDE_TOKEN } from 'utils/cloud-recognition/constants'

import Request from 'request-promise'

export function createTarget(name, imageUrl, physicalHeight) {
    console.log(WIKITUDE_COLLECTION_API_ROOT)
    console.log(WIKITUDE_TOKEN)
    const data = { name, imageUrl, physicalHeight }
    return Request({
        method: 'POST',
        uri: `${WIKITUDE_COLLECTION_API_ROOT}/target`,
        headers: {
            'content-type': 'application/json',
            'X-Version': 3,
            'X-Token': WIKITUDE_TOKEN
        },
        body: data,
        json: true
    }).then(response => {
        if (response.code) throw 'Invalid Data'
        else return response
    }).catch(err => err)
}
