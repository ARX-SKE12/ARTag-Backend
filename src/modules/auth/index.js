import auth from 'modules/auth/actions/auth'
import { eventJSONHandler } from 'utils/socket'
import events from 'modules/auth/events'

export default socket => {
    eventJSONHandler(socket, events.AUTH, data => auth(socket, data))
}
