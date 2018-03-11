import { errors, throwError } from 'modules/error'
import { resolveSelfObject, resolveUserObject } from 'modules/user'

import { PLACE_COLLECTION } from 'modules/place/constants'
import { create } from 'modules/mongo'
import events from 'modules/place/events'

function initializePlaceObject(placeObject) {
    placeObject.is_active = true
    placeObject.timestamp = Date.now()
    placeObject.meshes = []
    placeObject.tags = []
    return placeObject
}

export default (io, socket, placeData) => {
    const token = socket.handshake.session.token
    resolveSelfObject(token, placeData)
        .then(placeUserObject => {
            if (placeUserObject.error) throwError(socket, events.PLACE_CREATE_ERROR, errors.UNAUTHORIZED)
            else create(PLACE_COLLECTION, initializePlaceObject(placeUserObject))
                    .then(res => resolveUserObject(token, res.ops[0])
                                    .then(placeUserObject => socket.emit(events.PLACE_CREATE_SUCCESS, placeUserObject))
                                    .catch(() => throwError(socket, events.PLACE_CREATE_ERROR, errors.UNAUTHORIZED)))
                    .catch(() => throwError(socket, events.PLACE_CREATE_ERROR, errors.INTERNAL_ERROR))
        })
        .catch(() => throwError(socket, events.PLACE_CREATE_ERROR, errors.UNAUTHORIZED))
}
