import events from 'modules/room/events'
import joinRoom from 'modules/room/actions/joinRoom'
import leaveRoom from 'modules/room/actions/leaveRoom'

export default [
    {
        event: events.ROOM_JOIN,
        action: joinRoom
    },
    {
        event: events.ROOM_LEAVE,
        action: leaveRoom
    },
    {
        event: events.DISCONNECT,
        action: leaveRoom
    }
]