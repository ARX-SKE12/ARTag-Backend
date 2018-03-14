import { errors, throwError } from 'utils/error'

import Room from 'modules/room/store'
import events from 'modules/room/events'

export default (io, socket, placeData) => {
    const { user, token } = socket.handshake.session
    const { placeId } = placeData
    Room.joinRoom(placeId, user)
    socket.join(placeId)
    Room.getPeople(token, placeId)
        .then(userList => {
            const updateData = {
                new: userList[userList.length-1],
                userList: Array.from(new Set(userList))
            }
            io.to(placeId).emit(events.ROOM_USER_ARRIVE, updateData)
        })
        .catch(err => throwError(socket, events.ROOM_ERROR, errors.UNAUTHORIZED))
}
