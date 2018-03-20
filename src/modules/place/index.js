import createPlace from 'modules/place/actions/createPlace'
import { eventJSONHandler } from 'utils/socket'
import events from 'modules/place/events'
import listPlace from 'modules/place/actions/listPlace'
import updatePlace from 'modules/place/actions/updatePlace'

export default (io, socket) => {
    eventJSONHandler(socket, events.PLACE_CREATE, data => createPlace(io, socket, data))
    eventJSONHandler(socket, events.PLACE_LIST_REQUEST, data => listPlace(socket))
    eventJSONHandler(socket, events.PLACE_UPDATE, data => updatePlace(io, socket, data))
}
