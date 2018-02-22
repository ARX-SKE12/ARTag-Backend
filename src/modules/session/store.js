import ConnectMongo from 'connect-mongo'
import DotEnv from 'dotenv'
import ExpressSession from 'express-session'

DotEnv.config()

const MongoStore = ConnectMongo(ExpressSession)

const MONGO_URI = process.env.MONGO_URI

const store = new MongoStore({
    url: MONGO_URI
})

export default store