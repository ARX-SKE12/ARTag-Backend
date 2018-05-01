import { errors, throwError } from 'utils/error'

import Room from 'modules/room/store'
import events from 'modules/room/events'
import to from 'await-to-js'

export default async function(socket, placeData, io) {
    const { user, token } = socket.handshake.session
    const { placeId } = placeData
    socket.join(placeId)
    socket.handshake.session.currentRoom = placeId
    const [ joinErr ] = await to(Room.joinRoom(placeId, user))
    if (joinErr) throwError(socket, events.ROOM_ERROR, errors.UNAUTHORIZED)
    else {
        const [ getErr, room ] = await to(Room.getPeople(token, placeId))
        if (getErr) throwError(socket, events.ROOM_ERROR, errors.UNAUTHORIZED)
        else {
            const updateData = {
                new: room[room.length-1],
                userList: Array.from(new Set(room))
            }
            io.to(placeId).emit(events.ROOM_USER_ARRIVE, updateData)
            console.log(`${user} joined ${placeId}`)
        }
    }
}
