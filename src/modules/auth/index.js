import auth from 'modules/auth/actions/auth'

export default socket => {
    socket.on(events.AUTH, authData => auth(socket, authData))
}
