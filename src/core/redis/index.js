import BlueBird from 'bluebird'
import Redis from 'redis'

BlueBird.promisifyAll(Redis.RedisClient.prototype)

export default Redis.createClient()