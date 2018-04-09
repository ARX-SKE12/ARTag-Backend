import { errors, throwError } from 'utils/error'

import { PLACE_KIND } from 'modules/place/constants'
import events from 'modules/place/events'
import { query } from 'utils/datastore'
import { resolveUserListObject } from 'utils/user'
import to from 'await-to-js'

const FIELD_TIMESTAMP = 'timestamp'
const NO_MORE_RESULTS = 'NO_MORE_RESULTS'
const PAGE_SIZE = 5

export default async function listPlace(socket) {
    const { token, cursor } = socket.handshake.session
    const [ placeErr, placeResult ] = await to(query(PLACE_KIND, {
        cursor,
        orderBy: FIELD_TIMESTAMP,
        pageSize: PAGE_SIZE
    }))
    if (placeErr) throwError(socket, events.PLACE_LIST_ERROR, errors.INTERNAL_ERROR)
    else {
        const placeList = placeResult[0]
        const queryInfo = placeResult[1]
        socket.handshake.session.cursor = queryInfo.endCursor
        if (token) {
            const [ userErr, placeListWithUser ] = await to(resolveUserListObject(token, placeList))
            if (userErr) throwError(socket, events.PLACE_LIST_ERROR, errors.UNAUTHORIZED)
            else socket.emit(events.PLACE_LIST, placeListWithUser)
        } else throwError(socket, events.PLACE_LIST_ERROR, errors.TOKEN_LOST)
    }
}
