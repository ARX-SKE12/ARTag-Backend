import { errors, throwError } from 'modules/error'
import { resolveSelfObject, resolveUserObject } from 'modules/user'
import { retrieve, update } from 'modules/mongo'

import { PLACE_COLLECTION } from 'modules/place/constants'
import events from 'modules/place/events'

export default (io, socket, data) => {
    const { token, user } = socket.handshake.session
    const { id, updatedData } = data
    retrieve(PLACE_COLLECTION, id)
        .then(place => {
            if (place.user != user) throwError(socket, events.PLACE_UPDATE_ERROR, errors.PERMISSION_DENIED)
            else update(PLACE_COLLECTION, id, updatedData)
                    .then(res => {
                        socket.emit(events.PLACE_UPDATE_SUCCESS)
                        io.sockets.emit(events.PLACE_DATA_UPDATE)
                    })
                    .catch(err => throwError(socket, events.PLACE_UPDATE_ERROR, errors.INTERNAL_ERROR))
        })
        .catch(err => throwError(socket, events.PLACE_UPDATE_ERROR, errors.INTERNAL_ERROR))
}
