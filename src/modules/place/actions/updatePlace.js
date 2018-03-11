import { errors, throwError } from 'modules/error'
import { resolveSelfObject, resolveUserObject } from 'modules/user'

import { PLACE_COLLECTION } from 'modules/place/constants'
import events from 'modules/place/events'
import msgs from 'modules/place/msgs'
import { update } from 'modules/mongo'

export default (io, socket, data) => {
    
}