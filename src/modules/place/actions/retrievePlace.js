import { errors, throwError } from 'modules/error'

import { PLACE_COLLECTION } from 'modules/place/constants'
import events from 'modules/place/events'
import { resolveUser } from 'modules/user'
import { retrieve } from 'modules/mongo'

export default (socket, placeData) => {
    const token = socket.handshake.session.token
    retrieve(PLACE_COLLECTION, placeData.id, (err, res) => {
        if (err) throwError(socket, events.PLACE_ERROR, errors.INTERNAL_ERROR)
        else resolveUser(token, placeData, (err, resolvedUserData) => {
            if (err) throwError(socket, events.PLACE_ERROR, errors.INTERNAL_ERROR)
            else socket.emit(events.PLACE_RETRIEVE, resolvedUserData)
        })
    })
}
