import createPlace from 'modules/place/actions/createPlace'
import events from 'modules/place/events'
import listPlace from 'modules/place/actions/listPlace'
import updatePlace from 'modules/place/actions/updatePlace'

export default (io, socket) => {
    socket.on(events.PLACE_CREATE, data => createPlace(io, socket, data))
    socket.on(events.PLACE_LIST_REQUEST, () => listPlace(socket))
    socket.on(events.PLACE_UPDATE, data => updatePlace(io, socket, data))
}
