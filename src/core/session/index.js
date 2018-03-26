import ExpressSession from 'express-session'
import { SESSION_SECRET_KEY } from 'core/session/constants'
import SharedSession from 'express-socket.io-session'
import store from 'core/session/store'

const session = ExpressSession({
    secret: SESSION_SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    store
})

export default (app, io) => {
    app.use(session)
    io.use(SharedSession(session, {
        autoSave: true
    }))
}
