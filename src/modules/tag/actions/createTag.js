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
    const timestamp = Date.now().toString()
    if (image) {
        const [ compressErr, cpdImage ] = await to(compressImage(image, 800))
        if (compressErr) return null
        const [ uploadErr ] = await to(upload(CONTENT_BUCKET, `${timestamp}.png`, cpdImage))
        if (uploadErr) return null
    }
    delete tagData.detail.image
    tagData.timestamp = timestamp
    tagData.isActive = true
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
                                return tags[0][0]
                            }))
                            if (createErr) throwError(socket, events.TAG_ERROR, errors.INTERNAL_ERROR)
                            else {
                                const [ resolveErr, tagUser ] = await to(resolveUserObject(token, tagResult))
                                if (resolveErr) throwError(socket, events.TAG_ERROR, errors.UNAUTHORIZED)
                                else {
                                    socket.emit(events.TAG_CREATE_SUCCESS, { tag: tagUser })
                                    io.to(currentRoom).emit(events.TAG_DATA_UPDATE, { tag: tagUser })
                                    console.log(`${tagUser.user.name} created Tag called ${tagUser.id}`)
                                }
                            }
                        }
                    }
                }
            }
        } else throwError(socket, events.TAG_ERROR, errors.TOKEN_LOST)
    } else throwError(socket, events.TAG_ERROR, errors.PERMISSION_DENIED)
}
