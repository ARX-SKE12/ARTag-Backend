import { errors, throwError } from 'utils/error'
import { retrieve, update } from 'utils/datastore'

import { TAG_KIND } from 'modules/tag/constants'
import events from 'modules/tag/events'
import { resolveUserObject } from 'utils/user'
import to from 'await-to-js'

async function uploadImage(tagData) {
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
    return tagData
}

export default async function updateTag(socket, tagData, io) {
    const { token, user, currentRoom } = socket.handshake.session
    const { id, updatedData } = tagData 
    if (token) {
        if (currentRoom) {
            const [ retrieveErr, tag ] = await to(retrieve(TAG_KIND, tagData))            
            if (retrieveErr) throwError(socket, events.TAG_ERROR, errors.INTERNAL_ERROR)
            else {
                if (tag.user !== user) throwError(socket, events.TAG_ERROR, errors.PERMISSION_DENIED)
                else {
                    const updatedData = await uploadImage(updatedData)
                    if (updatedData) {
                        const [ updateErr, tagUpdatedData ] = await to(update(TAG_KIND, id, updatedData))
                        if (updateErr) throwError(socket, events.TAG_ERROR, errors.INTERNAL_ERROR)
                        else {
                            const [ resolveErr, tagUser ] = await to(resolveUserObject(token, tagUpdatedData))
                            if (resolveErr) throwError(socket, events.TAG_ERROR, errors.UNAUTHORIZED)
                            else {
                                socket.emit(events.TAG_UPDATE_SUCCESS, { tag: tagUser })
                                io.to(currentRoom).emit(events.TAG_DATA_UPDATE, { tag: tagUser })
                                console.log(`${tagUser.user.name} updated Tag called ${tagUser.id}`)
                            }
                        }
                    } else throwError(socket, events.TAG_ERROR, errors.INTERNAL_ERROR)
                } 
            }
        } else throwError(socket, events.TAG_ERROR, errors.PERMISSION_DENIED)
    } else throwError(socket, events.TAG_ERROR, errors.TOKEN_LOST)
}
