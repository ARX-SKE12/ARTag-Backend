import ExpressSession from 'express-session'
import { SESSION_SECRET_KEY } from 'modules/session/constants'
import store from 'modules/session/store'

const session = ExpressSession({
    secret: SESSION_SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    store
})

export default (app, io) => {
    app.use(session)
    io.use((socket, next) => session(socket.handshake, {}, next))
}