import { getMe, getUser } from 'modules/facebook'

export function resolveUserObject(accessToken, data) {
    return getUser(accessToken, data.user).then(user => {
        if (user.error) return user.error
        else {
            data.user = user
            return data
        }
    }).catch(err => err)
}

export function resolveSelfObject(accessToken, data) {
    return getMe(accessToken).then(user => {
        if (user.error) return user.error
        else {
            data.user = user.id
            return data
        }
    }).catch(err => err)
}

export function resolveUserList(accessToken, data, cb) {
    let ps = []
    data.map(datum => {
        ps.push(
            new Promise(
                (resolve, reject) => {
                    getUser(accessToken, datum.user, (err, userData) => {
                        if (err) cb(err)
                        else resolve(userData)
                    })
                }
            ))
    })

    Promise.all(ps).then(response => {
        for(var index in data){
            data[index].user = response[index]
        }
        cb(null, data)
    })
}
