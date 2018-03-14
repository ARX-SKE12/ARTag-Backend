import events from 'modules/room/events'
import joinRoom from 'modules/room/actions/joinRoom'

export default (io, socket) => {
    socket.on(events.ROOM_JOIN, data => joinRoom(io, socket, data))
}
