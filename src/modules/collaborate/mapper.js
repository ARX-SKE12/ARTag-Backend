import collabUpdate from 'modules/collaborate/actions/collabUpdate'
import events from 'modules/collaborate/events'

export default [
    {
        event: event.COLLABORATE_UPDATE,
        action: collabUpdate
    }
]