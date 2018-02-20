import DotEnv from 'dotenv'
import FacebookTokenStrategy from 'passport-facebook-token'
import Passport from 'passport'

DotEnv.config()

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET

Passport.use(new FacebookTokenStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET
}, (accessToken, refreshToken, profile, done) => {
    done(null, {
        profile
    })
}))

Passport.serializeUser((user, done) => done(null, user))

Passport.deserializeUser((user, done) => done(null, user))

export default Passport