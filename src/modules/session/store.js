import ConnectMongo from 'connect-mongo'
import ExpressSession from 'express-session'
import { MONGO_URI } from 'modules/session/constants'

const MongoStore = ConnectMongo(ExpressSession)

const store = new MongoStore({
    url: MONGO_URI
})

export default store