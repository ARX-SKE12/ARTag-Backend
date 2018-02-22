import DotEnv from 'dotenv'
import ExpressSession from 'express-session'
import store from 'modules/session/store'

DotEnv.config()


const SESSION_SECRET_KEY = process.env.SESSION_SECRET_KEY

export default ExpressSession({
    secret: SESSION_SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    store
})
