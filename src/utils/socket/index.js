
export function eventJSONHandler(socket, event, exec) {
    socket.on(event, data => {
        if (typeof data !== 'object') data = JSON.parse(data)
        exec(data)
    })
}
