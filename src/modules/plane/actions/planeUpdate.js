import { errors, throwError } from 'utils/error'
import { retrieve, update } from 'utils/datastore'

import { PLACE_KIND } from 'modules/plane/constants'
import events from 'modules/plane/events'
import to from 'await-to-js'

export default async function planeUpdate(socket, planeData, io) {
    const { user } = socket.handshake.session
    const { id, data } = planeData
    const [ retrieveErr, place ] = await to(retrieve(PLACE_KIND, id))
    if (retrieveErr) throwError(socket, events.PLANE_ERROR, errors.INTERNAL_ERROR)
    else {
        if (place.user !== user) throwError(socket, events.PLANE_ERROR, errors.PERMISSION_DENIED)
        else {
            const updateData = {
                planes: data
            }
            const [ updateErr ] = await to(update(PLACE_KIND, id, updateData))
            if (updateErr) throwError(socket, events.PLANE_ERROR, errors.INTERNAL_ERROR)
            else {
                io.to(id).emit(events.PLANE_UPGRADE)
            }
        }
    }
}
