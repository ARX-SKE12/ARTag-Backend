import { BUCKET_ROOT, CONTENT_BUCKET, PLACE_KIND, TAG_KIND } from 'modules/tag/constants';
import { create, retrieve } from 'utils/datastore'
import { errors, throwError } from 'utils/error'

import { compressImage } from 'utils/image'
import events from 'modules/tag/events'
import { resolveSelfObject } from 'utils/user'
import to from 'await-to-js'
import { upload } from 'utils/storage'

async function initializeTagObject(tagData) {
    const { detail } = tagData
    const { image } = detail
    if (image) {
        const [ compressErr, cpdImage ] = await to(compressImage(image, 800))
        if (compressErr) return null
        const [ uploadErr ] = await to(upload(CONTENT_BUCKET, `${Date.now().toString()}.png`, cpdImage))
        if (uploadErr) return null
        detail.image = cpdImage
    }
    return tagData
}

export default async function(socket, tagData, io) {
    const { token, user, currentRoom } = socket.handshake.session
    if (currentRoom) {
        const [ placeErr, place ] = await to(retrieve(PLACE_KIND, currentRoom))
        if (token) {
            if (placeErr) throwError(socket, events.TAG_ERROR, errors.INTERNAL_ERROR)
            else {
                if (!(place.is_public || place.user === user || place.users.indexOf(user) >= 0)) throwError(socket, events.TAG_ERROR, errors.PERMISSION_DENIED)
                else {
                    tagData.placeId = currentRoom
                    const [ userErr, tagDataWithUser ] = await to(resolveSelfObject(token, tagData))
                    if (userErr) throwError(socket, events.TAG_ERROR, errors.UNAUTHORIZED)
                    else {
                        const tag = initializeTagObject(tagDataWithUser)
                        if (!tag) throwError(socket, events.TAG_ERROR, errors.INTERNAL_ERROR)
                        else {
                            const [ createErr ] =  await to(create(TAG_KIND, tag))
                            if (createErr) throwError(socket, events.TAG_ERROR, errors.INTERNAL_ERROR)
                            else {
                                socket.emit(events.TAG_CREATE_SUCCESS)
                                io.to(currentRoom).emit(events.TAG_DATA_UPDATE)
                            }
                        }
                    }
                }
            }
        } else throwError(socket, events.TAG_ERROR, errors.TOKEN_LOST)
    } else throwError(socket, events.TAG_ERROR, errors.PERMISSION_DENIED)
}
