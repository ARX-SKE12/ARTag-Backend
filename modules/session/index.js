import ExpressSession from 'express-session'

const SESSION_SECRET_KEY = process.env.SESSION_SECRET_KEY

export default ExpressSession({
    secret: SESSION_SECRET_KEY,
    resave: true,
    saveUninitialized: true
})

