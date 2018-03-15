import { REDIS_HOST, REDIS_PORT } from 'core/adapter/constants'

import RedisAdapter from 'socket.io-redis'

const adapter = RedisAdapter({
    host: REDIS_HOST,
    port: REDIS_PORT
})

export default io => {
    io.adapter(adapter)
}
