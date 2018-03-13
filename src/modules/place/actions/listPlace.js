import { errors, throwError } from 'modules/error'

import { PLACE_KIND } from 'modules/place/constants'
import events from 'modules/place/events'
import { list } from 'modules/datastore'
import { resolveUserList } from 'modules/user'

export default socket => {
    const { token } = socket.handshake.session
    list(PLACE_KIND)
        .then(placeList => resolveUserList(token, placeList)
                                .then(placeUserList => socket.emit(events.PLACE_LIST, placeUserList))
                                .catch(err => throwError(socket, events.PLACE_LIST_ERROR, errors.INTERNAL_ERROR)))
        .catch(err => throwError(socket, events.PLACE_LIST_ERROR, errors.INTERNAL_ERROR))
}
