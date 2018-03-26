import { errors, throwError } from 'utils/error'

import { TAG_KIND } from 'modules/tag/constants'
import events from 'modules/tag/events'
import { queryFilter } from 'utils/datastore'
import { resolveUserListObject } from 'utils/user'
import to from 'await-to-js'

const PLACE_ID = 'placeId'

export default async function listTag(socket) {
    const { token, user, currentRoom } = socket.request.session
    if (currentRoom) {
        const [ listErr, tagList ] = await to(queryFilter(TAG_KIND, [{
            field: PLACE_ID,
            op: '=',
            value: currentRoom
        }]))
        if (listErr) throwError(socket, events.TAG_ERROR, errors.INTERNAL_ERROR)
        else {
            if (token) {
                const [ resolveErr, resolveTagList ] = await to(resolveUserListObject(token, tagList))
                if (resolveErr) throwError(socket, events.TAG_ERROR, errors.UNAUTHORIZED)
                else {
                    socket.emit(events.TAG_LIST, resolveTagList)
                }
            } else throwError(socket, events.TAG_ERROR, errors.TOKEN_LOST)
        }
    }
    else throwError(socket, events.TAG_ERROR, errors.PERMISSION_DENIED)
}