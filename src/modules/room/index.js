import events from 'modules/room/events'
import joinRoom from 'modules/room/actions/joinRoom'
import leaveRoom from 'modules/room/actions/leaveRoom'

export default (io, socket) => {
    socket.on(events.ROOM_JOIN, data => joinRoom(io, socket, data))
    socket.on(events.ROOM_LEAVE, () => leaveRoom(io, socket))
}
