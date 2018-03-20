import auth from 'modules/auth/actions/auth'
import events from 'modules/auth/events'

export default [
    {
        event: events.AUTH,
        action: auth
    }
]