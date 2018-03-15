import { getList, setList } from 'utils/redis-store'

import { resolveUserList } from 'utils/user'

class RoomManager {

    joinRoom(placeId, clientId) {
        return getList(placeId).then(room => {
            if (!room) room = [ clientId ]
            else room.push(clientId)
            return setList(placeId, room)
        }).catch(err => err)
    }
        
    leaveRoom(placeId, clientId) {
        return getList(placeId).then(room => {
            const index = room.indexOf(clientId)
            room.splice(index, 1)
            return setList(placeId, room)
        }).catch(err => err)
    }

    getPeople(accessToken, placeId) {
        return getList(placeId).then(room => {
            return resolveUserList(accessToken, room)}).catch(err => err)
    }

}

export default new RoomManager()
