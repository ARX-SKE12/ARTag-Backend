import { errors, throwError } from 'utils/error'

import Room from 'modules/room/store'
import events from 'modules/room/events'

export default (socket, placeData, io) => {
    const { user, token } = socket.handshake.session
    const { placeId } = placeData
    socket.join(placeId)
    socket.handshake.session.currentRoom = placeId
    Room.joinRoom(placeId, user)
            .then(() => {
                Room.getPeople(token, placeId)
                                .then(userList => {
                                    const updateData = {
                                        new: userList[userList.length-1],
                                        userList: Array.from(new Set(userList))
                                    }
                                    io.to(placeId).emit(events.ROOM_USER_ARRIVE, updateData)
                                })
                                .catch(err => throwError(socket, events.ROOM_ERROR, errors.UNAUTHORIZED))})
            .catch(err => throwError(socket, events.ROOM_ERROR, errors.UNAUTHORIZED))
}
