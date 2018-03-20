import { eventJSONHandler } from 'utils/socket'
import events from 'modules/room/events'
import joinRoom from 'modules/room/actions/joinRoom'
import leaveRoom from 'modules/room/actions/leaveRoom'

export default (io, socket) => {
    eventJSONHandler(socket, events.ROOM_JOIN, data => joinRoom(io, socket, data))
    eventJSONHandler(socket, events.ROOM_LEAVE, () => leaveRoom(io, socket))
    eventJSONHandler(socket, events.DISCONNECT, () => leaveRoom(io, socket))
}
