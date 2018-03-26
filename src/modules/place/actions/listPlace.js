import { errors, throwError } from 'utils/error'

import { PLACE_KIND } from 'modules/place/constants'
import events from 'modules/place/events'
import { list } from 'utils/datastore'
import { resolveUserListObject } from 'utils/user'
import to from 'await-to-js'

export default async function listPlace(socket) {
    const { token } = socket.request.session
    const [ placeErr, placeList ] = await to(list(PLACE_KIND))
    if (placeErr) throwError(socket, events.PLACE_LIST_ERROR, errors.INTERNAL_ERROR)
    else {
        if (token) {
            const [ userErr, placeListWithUser ] = await to(resolveUserListObject(token, placeList))
            if (userErr) throwError(socket, events.PLACE_LIST_ERROR, errors.UNAUTHORIZED)
            else socket.emit(events.PLACE_LIST, placeListWithUser)
        } else throwError(socket, events.PLACE_LIST_ERROR, errors.TOKEN_LOST)
    }
}
