import { errors, throwError } from 'modules/error'

import { PLACE_COLLECTION } from 'modules/place/constants'
import { create } from 'modules/mongo'
import events from 'modules/place/events'
import { resolveUserId } from 'modules/user'

function createPlace(socket, placeData) {
    create(PLACE_COLLECTION, placeData, (err, place) => {
        if (err) throwError(socket, events.PLACE_ERROR, errors.INTERNAL_ERROR)
        else socket.emit(events.PLACE_CREATE, place)
    })
}

function resolvePlaceCreator(socket, token, placeData) {
    resolveUserId(token, placeData, (err, resolvedUserIdPlaceData) => {
      if (err) throwError(socket, events.PLACE_ERROR, errors.INTERNAL_ERROR)
      else createPlace(socket, resolvedUserIdPlaceData)
    })
}

export default (socket, placeData) => {
    const token = socket.handshake.session.token
    resolvePlaceCreator(socket, token, placeData)
}