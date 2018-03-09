import { getUser } from 'modules/facebook'

export function resolveUser(accessToken, data, cb) {
    getUser(token, data.user, (err, userData) => {
        if (err) cb(err)
        else {
            data.user = userData
            cb(null, data)
        }
    })
}
