import { errors, events } from 'modules/auth/constants'

import { getMe } from 'modules/facebook'
import { throwError } from 'modules/error'

function emitAuthSuccess(socket, userData, token) {
    socket.handshake.session.token = token
    socket.emit(events.AUTH_SUCCESS, userData)
}

function emitAuthFailure(socket, error) {
    socket.emit(events.AUTH_ERROR, throwError(error))
}

export default socket => socket.on(events.AUTH, auth_data => {
    const token = auth_data.token
    if (token) getMe(token, (err, data) => {
        if (!!err) emitAuthFailure(socket, errors.INTERNAL_ERROR)
        else {
            if (data.error) emitAuthFailure(socket, errors.UNAUTHORIZED)   
            else emitAuthSuccess(socket, data, token)
        }
    })
    else emitAuthFailure(socket, errors.TOKEN_LOST)
})
