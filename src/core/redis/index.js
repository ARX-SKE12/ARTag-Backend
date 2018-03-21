import BlueBird from 'bluebird'
import Redis from 'redis'

BlueBird.promisifyAll(Redis.RedisClient.prototype)
BlueBird.promisifyAll(Redis.Multi.prototype)

const client = Redis.createClient()

client.flushdb()

export default client