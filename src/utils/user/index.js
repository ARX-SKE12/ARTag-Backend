import { getMe, getUser } from 'utils/facebook'

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

export function resolveUserList(accessToken, data) {
    const userPromises = data.map(datum => getUser(accessToken, datum.user))
    return Promise.all(userPromises)
                .then(userList => {
                    for (let index in data) data[index].user = userList[index]
                    return data
                })
                .catch(err => err)
}
