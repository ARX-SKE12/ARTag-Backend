import { errors, throwError } from 'utils/error'

import events from 'modules/auth/events'
import { getMe } from 'utils/facebook'
import to from 'await-to-js'

function emitSuccess(socket, userData, token) {
    socket.handshake.session.token = token
    socket.handshake.session.user = userData.id
    socket.emit(events.AUTH_SUCCESS, JSON.stringify(userData))
}

function emitError(socket, error) {
    throwError(socket, events.AUTH_ERROR, error)
}

export default async function auth(socket, authData) {
    const token = authData.token
    if (token) {
        const [ err, user ] = await to(getMe(token))
        if (err) emitError(socket, errors.UNAUTHORIZED)
        else {
            if (user.error) emitError(socket, errors.UNAUTHORIZED)
            else emitSuccess(socket, user, token)
        }
    } else emitError(socket, errors.TOKEN_LOST)
}
