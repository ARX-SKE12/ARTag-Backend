import { resolveUserList } from 'utils/user'

class RoomManager {

    constructor() {
        this.rooms = {}
    }

    joinRoom(placeId, clientId) {
        if (!this.rooms[placeId]) this.createRoom(placeId)
        this.rooms[placeId].push(clientId)
    }

    createRoom(placeId) {
        this.rooms[placeId] = []
    }
    
    leaveRoom(placeId, clientId) {
        const index = this.rooms[placeId].indexOf(clientId)
        if (index > -1) this.rooms[placeId].splice(index, 1)
    }

    getPeople(accessToken, placeId) {
        return resolveUserList(accessToken, this.rooms[placeId])
    }

}

export default new RoomManager()
