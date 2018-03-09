import { errors, throwError } from 'modules/error'
import { resolveUser, resolveUserId } from 'modules/user'

import { PLACE_COLLECTION } from 'modules/place/constants'
import { create } from 'modules/mongo'
import events from 'modules/place/events'

function resolvePlaceUser(socket, token, placeData) {
    resolveUser(token, placeData, (err, resolvedUserData) => {
        if (err) throwError(socket, events.PLACE_ERROR, errors.INTERNAL_ERROR)
        else socket.emit(events.PLACE_CREATE, resolvedUserData)
    })
}

function createPlace(socket, token, placeData) {
    create(PLACE_COLLECTION, placeData, (err, place) => {
        if (err) throwError(socket, events.PLACE_ERROR, errors.INTERNAL_ERROR)
        else resolvePlaceUser(socket, token, place)
    })
}

function resolvePlaceCreator(socket, token, placeData) {
    resolveUserId(token, placeData, (err, resolvedUserIdPlaceData) => {
      if (err) throwError(socket, events.PLACE_ERROR, errors.INTERNAL_ERROR)
      else createPlace(socket, token, resolvedUserIdPlaceData)
    })
}

export default (socket, placeData) => {
    const token = socket.handshake.session.token
    resolvePlaceCreator(socket, token, placeData)
}
