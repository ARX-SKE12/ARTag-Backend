
export function eventJSONHandler(socket, event, exec) {
    socket.on(event, data => {
        try {
            data = JSON.parse(data)
        } catch(e) {}
        exec(data)
    })
}

export function socketMapper(socket, mapper, io) {
    mapper.map(eventData => eventJSONHandler(socket, eventData.event, data => eventData.action(socket, data, io)))
}
