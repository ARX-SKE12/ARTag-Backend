import { PLACE_KIND, TAG_KIND } from 'modules/tag/constants';
import { create, retrieve } from 'utils/datastore'
import { errors, throwError } from 'utils/error'

import events from 'modules/tag/events'
import { resolveSelfObject } from 'utils/user'
import to from 'await-to-js'

export default async function(socket, tagData, io) {
    const { token, user, currentRoom } = socket.handshake.session
    if (currentRoom) {
        const [ placeErr, place ] = await to(retrieve(PLACE_KIND, currentRoom))
        if (token) {
            if (placeErr) throwError(socket, events.TAG_ERROR, errors.INTERNAL_ERROR)
            else {
                if (!(place.is_public || place.user === user || place.users.indexOf(user) >= 0)) throwError(socket, events.TAG_ERROR, errors.PERMISSION_DENIED)
                else {
                    tagData.placeId = currentRoom
                    const [ userErr, tagDataWithUser ] = await to(resolveSelfObject(token, tagData))
                    if (userErr) throwError(socket, events.TAG_ERROR, errors.UNAUTHORIZED)
                    else {
                        const [ createErr ] =  await to(create(TAG_KIND, tagDataWithUser))
                        if (createErr) throwError(socket, events.TAG_ERROR, errors.INTERNAL_ERROR)
                        else {
                            socket.emit(events.TAG_CREATE_SUCCESS)
                            io.to(currentRoom).emit(events.TAG_ARRIVE)
                        }
                    }
                }
            }
        } else throwError(socket, events.TAG_ERROR, errors.TOKEN_LOST)
    } else throwError(socket, events.TAG_ERROR, errors.PERMISSION_DENIED)
}
