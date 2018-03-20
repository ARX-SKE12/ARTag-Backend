import { errors, throwError } from 'utils/error'
import { resolveSelfObject, resolveUserObject } from 'utils/user'
import { retrieve, update } from 'utils/datastore'

import { PLACE_KIND } from 'modules/place/constants'
import events from 'modules/place/events'

export default (socket, data, io) => {
    const { token, user } = socket.handshake.session
    const { id, updatedData } = data
    retrieve(PLACE_KIND, id)
        .then(place => {
            if (place[0].user != user) throwError(socket, events.PLACE_UPDATE_ERROR, errors.PERMISSION_DENIED)
            else update(PLACE_COLLECTION, id, updatedData)
                    .then(() => {
                        socket.emit(events.PLACE_UPDATE_SUCCESS)
                        io.sockets.emit(events.PLACE_DATA_UPDATE)
                    })
                    .catch(err => throwError(socket, events.PLACE_UPDATE_ERROR, errors.INTERNAL_ERROR))
        })
        .catch(err => throwError(socket, events.PLACE_UPDATE_ERROR, errors.INTERNAL_ERROR))
}
