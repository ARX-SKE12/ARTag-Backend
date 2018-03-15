import RedisClient from 'core/redis'

export function set(key, value) {
    return RedisClient.setAsync(key, value)
}

export function get(key) {
    RedisClient.getAsync(key)
}

export function remove(key) {
    RedisClient.del(key)
}
