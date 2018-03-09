import createPlace from 'modules/place/actions/createPlace'
import events from 'modules/place/events'
import listPlace from 'modules/place/actions/listPlace'
import retrievePlace from 'modules/place/actions/retrievePlace'

export default socket => {
    socket.on(events.PLACE_CREATE, data => createPlace(socket, data))
    socket.on(events.PLACE_LIST, () => listPlace(socket))
    socket.on(events.PLACE_RETRIEVE, data => retrievePlace(socket, data))
}
