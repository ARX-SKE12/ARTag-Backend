import RedisClient from 'core/redis'

export function set(key, value) {
    return RedisClient.setAsync(key, value)
}

export function setList(key, list) {
    const multi = RedisClient.multi()
    multi.del(key)
    return multi.execAsync().then(() => {
        for (let i = 0 ; i < list.length ; i++) multi.rpush(key, list[i])
        return multi.execAsync()
    }).catch(err => err)
}

export function getList(key) {
    return RedisClient.lrangeAsync(key, 0, -1)
}

export function get(key) {
    return RedisClient.getAsync(key)
}

export function remove(key) {
    return RedisClient.del(key)
}
