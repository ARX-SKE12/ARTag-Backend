
export function eventJSONHandler(socket, event, exec) {
    socket.on(event, data => {
        if (typeof data !== 'object') data = JSON.parse(data)
        exec(data)
    })
}

export function socketMapper(socket, mapper, io) {
    mapper.map(eventData => eventJSONHandler(socket, eventData.event, data => eventData.action(socket, data, io)))
}
