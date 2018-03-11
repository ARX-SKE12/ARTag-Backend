import { errors, throwError } from 'modules/error'

import { PLACE_COLLECTION } from 'modules/place/constants'
import events from 'modules/place/events'
import { list } from 'modules/mongo'
import { resolveUserList } from 'modules/user'

export default socket => {
    const token = socket.handshake.session.token
    list(PLACE_COLLECTION)
        .then(placeList => resolveUserList(token, placeList)
                                .then(placeUserList => socket.emit(events.PLACE_LIST, placeUserList))
                                .catch(err => throwError(socket, events.PLACE_LIST_ERROR, errors.INTERNAL_ERROR)))
        .catch(err => throwError(socket, events.PLACE_LIST_ERROR, errors.INTERNAL_ERROR))
}