import { errors, throwError } from 'utils/error'

import Room from 'modules/room/store'
import events from 'modules/room/events'
import { getMe } from 'utils/facebook'
import to from 'await-to-js'

export default async function leaveRoom(socket, data, io) {
    const { user, token, currentRoom } = socket.handshake.session
    socket.leave(currentRoom)
    const [ leaveErr, leaveSuccess ] = await to(Room.leaveRoom(currentRoom, user))
    if (leaveErr) throwError(socket, events.ROOM_ERROR, errors.UNAUTHORIZED)
    else {
        const [ getErr, room ] = await to(Room.getPeople(token, currentRoom))
        if (getErr) throwError(socket, events.ROOM_ERROR, errors.UNAUTHORIZED)
        else {
            const [ userErr, user ] = await to(getMe(token))
            if (userErr) throwError(socket, events.ROOM_ERROR, errors.UNAUTHORIZED)
            else {
                const updateData = {
                    left: user,
                    userList: Array.from(new Set(room))
                }
                io.to(currentRoom).emit(events.ROOM_USER_LEFT, updateData)
            }
        }
    }
    delete socket.handshake.session.currentRoom
}
