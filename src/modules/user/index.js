import { getMe, getUser } from 'modules/facebook'

export function resolveUser(accessToken, data, cb) {
    getUser(token, data.user, (err, userData) => {
        if (err) cb(err)
        else {
            data.user = userData
            cb(null, data)
        }
    })
}

export function resolveUserId(accessToken, data, cb) {
    getMe(accessToken, (err, userData) => {
        if (err) cb(err)
        else {
            data.user = userData.id
            cb(null, data)
        }
    })
}
