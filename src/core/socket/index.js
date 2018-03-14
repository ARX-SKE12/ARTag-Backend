import AuthEvent from 'modules/auth'
import ExpressApp from 'core/express-app'
import PlaceEvent from 'modules/place'
import RoomEvent from 'modules/room'
import Server from 'core/server'
import Session from 'core/session'
import Socket from 'socket.io'
import events from 'core/socket/events'

export default () => {
    const io = Socket(Server)

    Session(ExpressApp, io)

    io.on(events.CONNECTION, socket => {
    
        const address = socket.handshake.address
        
        console.log(`${address} is connected.`)

        AuthEvent(socket)

        PlaceEvent(io, socket)

        RoomEvent(io, socket)

    })
}
