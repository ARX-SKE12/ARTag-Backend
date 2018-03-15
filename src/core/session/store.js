import { REDIS_HOST, REDIS_PORT } from 'core/session/constants'

import ConnectRedis from 'connect-redis'
import ExpressSession from 'express-session'
import RedisClient from 'core/redis'

const RedisStore = ConnectRedis(ExpressSession)

export default new RedisStore({
    host: REDIS_HOST,
    port: REDIS_PORT,
    client: RedisClient
})
