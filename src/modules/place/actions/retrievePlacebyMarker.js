import { errors, throwError } from 'utils/error'

import { PLACE_KIND } from 'modules/place/constants'
import events from 'modules/place/events'
import { queryFilter } from 'utils/datastore'
import to from 'await-to-js'

const MARKER_FIELD = 'marker'

export default async function  retrievePlacebyMarker(socket, data) {
    const { marker } = data
    const { token, user } = socket.handshake.session
    const [ queryErr, place ] = await to(queryFilter(PLACE_KIND, [{
        field: MARKER_FIELD,
        op: '=',
        value: marker
    }]))
    if (queryErr) throwError(socket, events.PLACE_ERROR_MARKER, errors.INTERNAL_ERROR)
    else socket.emit(events.PLACE_RESPONSE_MARKER, place)
}
