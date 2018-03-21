import { getMe, getUser } from 'utils/facebook'

import to from 'await-to-js'

export async function resolveUserObject(accessToken, data) {
    const [ err, user ] = await to(getUser(accessToken, data.user))
    if (err) return null
    else {
        if (user.error) return null
        data.user = user
        return data
    }
}

export async function resolveSelfObject(accessToken, data) {
    const [ err, user ] = await to(getMe(accessToken))
    if (err) return null
    else {
        if (user.error) return null
        data.user = user.id
        return data
    }
}

export function resolveUserListObject(accessToken, data) {
    const userPromises = data.map(datum => getUser(accessToken, datum.user))
    return Promise.all(userPromises)
                .then(userList => {
                    for (let index in data) data[index].user = userList[index]
                    return data
                })
                .catch(err => err)
}

export function resolveUserList(accessToken, userList) {
    const userListPromises = userList.map(user => getUser(accessToken, user))
    return Promise.all(userListPromises)
}
