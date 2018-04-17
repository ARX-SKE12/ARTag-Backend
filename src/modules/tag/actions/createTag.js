import { BUCKET_ROOT, CONTENT_BUCKET, PLACE_KIND, TAG_KIND } from 'modules/tag/constants';
import { create, query, retrieve } from 'utils/datastore'
import { errors, throwError } from 'utils/error'
import { resolveSelfObject, resolveUserObject } from 'utils/user'

import { compressImage } from 'utils/image'
import events from 'modules/tag/events'
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
    tagData.timestamp = Date.now().toString()
    return tagData
}

export default async function createTag(socket, tagData, io) {
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
                        const tag = await initializeTagObject(tagDataWithUser)
                        if (!tag) throwError(socket, events.TAG_ERROR, errors.INTERNAL_ERROR)
                        else {
                            const [ createErr, tagResult ] =  await to(create(TAG_KIND, tag).then(() => query(TAG_KIND, {
                                filters: [{
                                    field: 'timestamp',
                                    op: '=',
                                    value: tag.timestamp
                                }]
                            })).catch(err => err).then(tags => {
                                console.log(tags)
                                return tags[0][0]
                            }))
                            console.log(createErr)
                            if (createErr) throwError(socket, events.TAG_ERROR, errors.INTERNAL_ERROR)
                            else {
                                console.log(tagResult)
                                const [ resolveErr, tagUser ] = await to(resolveUserObject(token, tagResult))
                                console.log(resolveErr)
                                if (resolveErr) throwError(socket, events.TAG_ERROR, errors.UNAUTHORIZED)
                                else {
                                    console.log(tagUser)
                                    socket.emit(events.TAG_CREATE_SUCCESS, { tag: tagUser })
                                    io.to(currentRoom).emit(events.TAG_DATA_UPDATE, { tag: tagUser })
                                }
                            }
                        }
                    }
                }
            }
        } else throwError(socket, events.TAG_ERROR, errors.TOKEN_LOST)
    } else throwError(socket, events.TAG_ERROR, errors.PERMISSION_DENIED)
}
