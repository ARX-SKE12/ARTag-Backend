import createPlace from 'modules/place/actions/createPlace'
import events from 'modules/place/events'
import listPlace from 'modules/place/actions/listPlace'

export default socket => {
    socket.on(events.PLACE_CREATE, data => createPlace(socket, data))
    socket.on(events.PLACE_LIST, () => listPlace(socket))
}
