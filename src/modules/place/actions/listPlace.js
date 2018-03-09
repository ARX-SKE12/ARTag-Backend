import { errors, throwError } from 'modules/error'

import { PLACE_COLLECTION } from 'modules/place/constants'
import events from 'modules/place/events'
import { list } from 'modules/mongo'

export default socket => {
    list(PLACE_COLLECTION, (err, places) => {
        if (err) throwError(socket, events.PLACE_ERROR, errors.INTERNAL_ERROR)
        else socket.emit(events.PLACE_LIST, places)
    })
}