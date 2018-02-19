import FacebookTokenStrategy from 'passport-facebook-token'
import Passport from 'passport'

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET

Passport.use(new FacebookTokenStrategy(
    new FacebookTokenStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET
    })
))