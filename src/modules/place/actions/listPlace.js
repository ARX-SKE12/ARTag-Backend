import { errors, throwError } from 'utils/error'

import { PLACE_KIND } from 'modules/place/constants'
import events from 'modules/place/events'
import { list } from 'utils/datastore'
import { resolveUserList } from 'utils/user'

export default socket => {
    const { token } = socket.handshake.session
    list(PLACE_KIND)
        .then(placeList => resolveUserList(token, placeList)
                                .then(placeUserList => socket.emit(events.PLACE_LIST, placeUserList))
                                .catch(err => throwError(socket, events.PLACE_LIST_ERROR, errors.INTERNAL_ERROR)))
        .catch(err => throwError(socket, events.PLACE_LIST_ERROR, errors.INTERNAL_ERROR))
}
