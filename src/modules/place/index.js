import createPlace from 'modules/place/actions/createPlace'
import events from 'modules/place/events'
import listPlace from 'modules/place/actions/listPlace'

export default (io, socket) => {
    socket.on(events.PLACE_CREATE, data => createPlace(io, socket, data))
    socket.on(events.PLACE_LIST_REQUEST, () => listPlace(socket))
}
