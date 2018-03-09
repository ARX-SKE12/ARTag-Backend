import createPlace from 'modules/place/actions/createPlace'
import events from 'modules/place/events'

export default socket => {
    socket.on(events.PLACE_CREATE, data => createPlace(socket, data))
}
