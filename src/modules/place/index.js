import { PLACE_COLLECTION, events } from 'modules/place/constants'
import { create, retrieve } from 'modules/mongo'

import { errors } from 'modules/mongo/constants'
import { throwError } from 'modules/error'

export default function createPlace(socket, data) {
    create(PLACE_COLLECTION, data, (err, place) => {
        if (err) throwError(events.PLACE_ERROR, throwError(error))
        else socket.emit(events.PLACE_LIST, place)
    })
}

export default function listPlace(socket, data) {
    
}

export default socket => {
    socket.on(events.PLACE_CREATE, data => createPlace(socket, data))
}
