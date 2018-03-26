import { errors, throwError } from 'utils/error'

import { PLACE_KIND } from 'modules/place/constants'
import { create } from 'utils/datastore'
import events from 'modules/place/events'
import { resolveSelfObject } from 'utils/user'
import to from 'await-to-js'

function initializePlaceObject(placeObject) {
    placeObject.is_active = true
    placeObject.timestamp = Date.now()
    placeObject.meshes = []
    placeObject.tags = []
    return placeObject
}

export default async function createPlace(socket, placeData, io) {
    const { token } = socket.request.session
    if (token) {
        const [ resolveErr, placeWithUser ] = await to(resolveSelfObject(token, placeData))
        if (resolveErr) throwError(socket, events.PLACE_CREATE_ERROR, errors.UNAUTHORIZED)
        else {
            const [ createErr ] = await to(create(PLACE_KIND, initializePlaceObject(placeWithUser)))
            if (createErr) throwError(socket, events.PLACE_CREATE_ERROR, errors.INTERNAL_ERROR)
            else {
                socket.emit(events.PLACE_CREATE_SUCCESS)
                io.sockets.emit(events.PLACE_DATA_UPDATE)
            }
        }
    } else throwError(socket, events.PLACE_CREATE_ERROR, errors.TOKEN_LOST)
}
