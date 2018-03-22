import { errors, throwError } from 'utils/error'
import { resolveSelfObject, resolveUserObject } from 'utils/user'
import { retrieve, update } from 'utils/datastore'

import { PLACE_KIND } from 'modules/place/constants'
import events from 'modules/place/events'
import to from 'await-to-js'

export default async function(socket, data, io) {
    const { token, user } = socket.handshake.session
    const { id, updatedData } = data
    const [ retrieveErr, place ] = await to(retrieve(PLACE_KIND, id))
    if (retrieveErr) throwError(socket, events.PLACE_UPDATE_ERROR, errors.INTERNAL_ERROR)
    else {
        if (place.user != user) throwError(socket, events.PLACE_UPDATE_ERROR, errors.PERMISSION_DENIED)
        else {
            const [ updateErr, result ] = await to(update(PLACE_KIND, id, updatedData))
            if (updateErr) throwError(socket, events.PLACE_UPDATE_ERROR, errors.INTERNAL_ERROR)
            else {
                socket.emit(events.PLACE_UPDATE_SUCCESS)
                io.sockets.emit(events.PLACE_DATA_UPDATE)
            }
        }
    }
}
