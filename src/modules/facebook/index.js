import { FACEBOOK_GRAPH_API_ROOT, ME, REQUIRED_FIELDS } from 'modules/facebook/constants'

import Request from 'request-promise'

function fetchFromFacebook(access_token, callback, id) {
    if (!id) id = ME
    const qs = {
        access_token,
        fields: REQUIRED_FIELDS
    }
    Request.get({
        url:`${FACEBOOK_GRAPH_API}/${id}`,
        qs
    }).then(res => callback(null, res)).catch(err => callback(err))
}

export function getMe(access_token, callback) {
    fetchFromFacebook(access_token, callback)
}

export function getUser(access_token, id, callback) {
    fetchFromFacebook(access_token, callback, id)
}
