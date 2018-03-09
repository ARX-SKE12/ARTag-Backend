import { PLACE_COLLECTION, events } from 'modules/place/constants'
import { create, retrieve } from 'modules/mongo'
import { resolveUser, resolveUserId } from 'modules/user'

import { errors as mongoErrors } from 'modules/mongo/constants'
import { errors as authErrors } from 'modules/auth/constants'
import { throwError } from 'modules/error'

export default function createPlace(socket, data) {
    resolveUserId(socket.handshake.session.token, data, (err, resolveUserIdData) => {
        if (err) socket.emit(events.PLACE_ERROR, throwError(authErrors))
        create(PLACE_COLLECTION, resolveUserIdData, (err, place) => {
            if (err) socket.emit(events.PLACE_ERROR, throwError(mongoErrors.MONGO_ERROR))
        })
    })
}

export default function listPlace(socket, data) {
    
}

export default socket => {
    socket.on(events.PLACE_CREATE, data => createPlace(socket, data))
}
