
export default (socket) => {
    delete socket.handshake.session.cursor
}