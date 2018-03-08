import { create, retrieve } from 'modules/mongo'

import { errors } from 'modules/mongo/constants'
import { events } from 'modules/place/constants'
import { throwError } from 'modules/error'

function createPlace(socket, data) {
    create('place', data, (err, place) => {
        if (err) throwError(events.PLACE_ERROR, throwError(error))
        else socket.emit(events.PLACE_LIST, place)
    })
}

export default socket => {
    socket.on(events.PLACE_CREATE, data => createPlace(socket, data))
}