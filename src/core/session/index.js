import ExpressSession from 'express-session'
import { SESSION_SECRET_KEY } from 'core/session/constants'
import store from 'core/session/store'

const session = ExpressSession({
    secret: SESSION_SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    store
})

export default (app, io) => {
    app.use(session)
    console.log(session)
    io.use((socket, next) => {
        session(socket.handshake, {}, next)
        console.log(socket.handshake.session)
    })
}
