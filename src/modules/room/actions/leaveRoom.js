import { errors, throwError } from 'utils/error'

import Room from 'modules/room/store'
import events from 'modules/room/events'
import { getMe } from 'utils/facebook'

export default (socket, data, io) => {
    const { user, token, currentRoom } = socket.handshake.session
    socket.leave(currentRoom)
    Room.leaveRoom(currentRoom, user)
            .then(() => {
                Room.getPeople(token, currentRoom)
                        .then(userList => getMe(token)
                                            .then(currentUser => {
                                            const updateData = {
                                                left: currentUser,
                                                userList: Array.from(new Set(userList))
                                            }
                                            io.to(currentRoom).emit(events.ROOM_USER_LEFT, updateData)
                                            })
                                            .catch(err => throwError(socket, events.ROOM_ERROR, errors.UNAUTHORIZED)))
                        .catch(err => throwError(socket, events.ROOM_ERROR, errors.UNAUTHORIZED))
            })
            .catch(err => throwError(socket, events.ROOM_ERROR, errors.UNAUTHORIZED))
    delete socket.handshake.session.currentRoom
    
}
