import createPlace from 'modules/place/actions/createPlace'
import events from 'modules/place/events'
import listPlace from 'modules/place/actions/listPlace'
import updatePlace from 'modules/place/actions/updatePlace'

export default [
    {
        event: events.PLACE_CREATE,
        action: createPlace
    },
    {
        event: events.PLACE_LIST_REQUEST,
        action: listPlace
    },
    {
        event: events.PLACE_UPDATE,
        action: updatePlace
    },
]
