import AuthEvent from 'modules/auth'
import ExpressApp from 'modules/express-app'
import PlaceEvent from 'modules/place'
import RoomEvent from 'modules/room'
import Server from 'modules/server'
import Session from 'modules/session'
import Socket from 'socket.io'
import events from 'modules/socket/events'

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
