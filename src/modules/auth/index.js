import auth from 'modules/auth/actions/auth'
import events from 'modules/auth/events'

export default socket => {
    socket.on(events.AUTH, authData => auth(socket, authData))
}
