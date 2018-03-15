import { REDIS_HOST, REDIS_PORT } from 'core/session/constants'

import ConnectRedis from 'connect-redis'
import ExpressSession from 'express-session'
import Redis from 'redis'

const RedisStore = ConnectRedis(ExpressSession)
const RedisClient = Redis.createClient()

export default new RedisStore({
    host: REDIS_HOST,
    port: REDIS_PORT,
    client: RedisClient
})
