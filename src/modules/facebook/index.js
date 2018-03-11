import { FACEBOOK_GRAPH_API_ROOT, ME, REQUIRED_FIELDS } from 'modules/facebook/constants'

import Request from 'request-promise'

function fetchFromFacebook(access_token, id) {
    if (!id) id = ME
    const qs = {
        access_token,
        fields: REQUIRED_FIELDS
    }
    return Request.get({
        url:`${FACEBOOK_GRAPH_API_ROOT}/${id}`,
        qs,
        json: true
    }).then(res => ({
        id: res.id,
        name: res.name,
        profilePictureURL: res.picture.data.url
    })).catch(err => err)
}

export function getMe(access_token) {
    return fetchFromFacebook(access_token)
}

export function getUser(access_token, id) {
    return fetchFromFacebook(access_token, id)
}
