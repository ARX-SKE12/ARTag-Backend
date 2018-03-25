import events from 'modules/plane/events'
import planeUpdate from 'modules/plane/actions/planeUpdate'

export default [
    {
        event: events.PLANE_UPDATE,
        action: planeUpdate
    } 
]
