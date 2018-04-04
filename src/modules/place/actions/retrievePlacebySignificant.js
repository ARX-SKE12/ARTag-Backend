import { errors, throwError } from 'utils/error'

import { Base64 } from 'js-base64'
import { PLACE_KIND } from 'modules/place/constants'
import events from 'modules/place/events'
import { queryFilter } from 'utils/datastore'
import to from 'await-to-js'

const TIMESTAMP_FIELD = 'timestamp'
const NAME_FIELD = 'name'

export default async function  retrievePlacebySignificant(socket, data) {
    const { encodedSignificant } = data
    const decodedData = Base64.decode(encodedSignificant).split('-')
    const timestamp = decodedData[0]
    const name = decodedData[1]
    const { token, user } = socket.handshake.session
    const [ queryErr, place ] = await to(queryFilter(PLACE_KIND, [{
        field: TIMESTAMP_FIELD,
        op: '=',
        value: timestamp
    }, {
        field: NAME_FIELD,
        op: '=',
        value: name
    }]))
    if (queryErr) throwError(socket, events.PLACE_ERROR_SIGNIFICANT, errors.INTERNAL_ERROR)
    else socket.emit(events.PLACE_RESPONSE_SIGNIFICANT, place)
}
