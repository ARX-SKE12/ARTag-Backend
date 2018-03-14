import { errors, throwError } from 'utils/error'

import events from 'modules/auth/events'
import { getMe } from 'utils/facebook'

function emitSuccess(socket, userData, token) {
    socket.handshake.session.token = token
    socket.handshake.session.user = userData.id
    socket.emit(events.AUTH_SUCCESS, userData)
}

function emitError(socket, error) {
    throwError(socket, events.AUTH_ERROR, error)
}

function authDataWithFB(socket, token) {
    getMe(token).then(data => {
        if (data.error) emitError(socket, errors.UNAUTHORIZED)
        else emitSuccess(socket, data, token)
    }).catch(err => emitError(socket, errors.INTERNAL_ERROR))
}

export default (socket, authData) => {
    const token = authData.token
    if (token) authDataWithFB(socket, token)
    else emitError(socket, errors.TOKEN_LOST)
}
