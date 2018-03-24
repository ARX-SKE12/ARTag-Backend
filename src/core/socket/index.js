import Adapter from 'core/adapter'
import AuthEvent from 'modules/auth'
import ExpressApp from 'core/express-app'
import PlaceEvent from 'modules/place'
import PlaneEvent from 'modules/plane'
import RoomEvent from 'modules/room'
import Server from 'core/server'
import Session from 'core/session'
import Socket from 'socket.io'
import TagEvent from 'modules/tag'
import events from 'core/socket/events'

export default () => {
    const io = Socket(Server)

    Adapter(io)

    Session(ExpressApp, io)

    io.on(events.CONNECTION, socket => {
    
        const address = socket.handshake.address
        
        console.log(`${address} is connected.`)

        AuthEvent(socket)

        PlaceEvent(io, socket)

        RoomEvent(io, socket)

        TagEvent(io, socket)
        
        PlaneEvent(io, socket)
        
    })
}
