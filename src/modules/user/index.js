import { getMe, getUser } from 'modules/facebook'

export function resolveUser(accessToken, data, cb) {
    getUser(accessToken, data.user, (err, userData) => {
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

export function resolveUserList(accessToken, data, cb) {
    data.forEach(datum => {
        getUser(accessToken, datum.user, (err, userData) => {
            if (err) cb(err)
            else datum.user = userData
        })
    })
    cb(null, data)
}