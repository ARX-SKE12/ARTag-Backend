import collabAdd from 'modules/collaborate/actions/collabAdd'
import events from 'modules/collaborate/events'

export default [
    {
        event: event.COLLABORATE_ADD,
        action: collabAdd
    }
]