import createTag from 'modules/tag/actions/createTag'
import editTag from 'modules/tag/actions/editTag'
import events from 'modules/tag/events'
import removeTag from 'modules/tag/actions/removeTag'

export default (io, socket) => {
    socket.on(events.TAG_CREATE, data => createTag(io, socket, data))
    socket.on(events.TAG_EDIT, data => editTag(io, socket, data))
    socket.on(events.TAG_REMOVE, data => removeTag(io, socket, data))
}