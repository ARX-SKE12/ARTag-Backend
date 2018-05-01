import { retrieve, update } from 'utils/datastore'

import { PLACE_KIND } from 'modules/collaborate/constatns'
import events from 'modules/collaborate/events'
import to from 'await-to-js'

export default async function collabUpdate(socket, data) {
    const { user, token } = socket.handshake.session
    const { users } = data
    const [ retrieveErr, place ] = await to(retrieve(PLACE_KIND, id))
    if (retrieveErr) throwError(socket, events.COLLABORATE_ERROR, errors.INTERNAL_ERROR)
    else {
        if (place.user !== user) throwError(socket, events.COLLABORATE_ERROR, errors.PERMISSION_DENIED)
        else {
            const updateData = {
                users
            }
            const [ updateErr, updatedPlace ] = await to(update(PLACE_KIND, id, updateData))
            if (updateErr) throwError(socket, events.COLLABORATE_ERROR, errors.INTERNAL_ERROR)
            else {
                const [ resolveErr, placeWithUser ] = await to(resolveUserObject(token, updatedPlace))
                if (resolveErr) throwError(socket, events.COLLABORATE_ERROR, errors.UNAUTHORIZED)
                else {
                    socket.emit(events.COLLABORATE_ADD_SUCCESS, { place: placeWithUser })
                    console.log(`${placeWithUser.name}'s collaborator has updated!`)
                }
            }
        }
    }
}
