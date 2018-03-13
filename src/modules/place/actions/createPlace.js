import { errors, throwError } from 'modules/error'
import { resolveSelfObject, resolveUserObject } from 'modules/user'

import { PLACE_KIND } from 'modules/place/constants'
import { create } from 'modules/datastore'
import events from 'modules/place/events'

function initializePlaceObject(placeObject) {
    placeObject.is_active = true
    placeObject.timestamp = Date.now()
    placeObject.meshes = []
    placeObject.tags = []
    return placeObject
}

export default (io, socket, placeData) => {
    const { token } = socket.handshake.session
    resolveSelfObject(token, placeData)
        .then(placeUserObject => {
            if (placeUserObject.error) throwError(socket, events.PLACE_CREATE_ERROR, errors.UNAUTHORIZED)
            else create(PLACE_KIND, initializePlaceObject(placeUserObject))
                    .then(res => {
                        socket.emit(events.PLACE_CREATE_SUCCESS)
                        io.sockets.emit(events.PLACE_DATA_UPDATE)
                    })
                    .catch(() => throwError(socket, events.PLACE_CREATE_ERROR, errors.INTERNAL_ERROR))
        })
        .catch(() => throwError(socket, events.PLACE_CREATE_ERROR, errors.UNAUTHORIZED))
}
