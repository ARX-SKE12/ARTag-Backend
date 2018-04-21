import { PLACE_KIND, THUMBNAIL_BUCKET } from 'modules/place/constants'
import { errors, throwError } from 'utils/error'
import { resolveSelfObject, resolveUserObject } from 'utils/user'
import { retrieve, update } from 'utils/datastore'

import { compressImage } from 'utils/image'
import events from 'modules/place/events'
import to from 'await-to-js'
import { upload } from 'utils/storage'

async function updateThumbnail(updatedData) {
    const { thumbnail, timestamp, name } = updatedData
    const significant = `${timestamp}-${name}`
    const imageName = `${significant}.png`
    const [ compressThumbnailErr, thumbnailImage ] = await to(compressImage(thumbnail, 800))
    if (compressThumbnailErr) return false
    const [ uploadThumbnailErr ] = await to(upload(THUMBNAIL_BUCKET, imageName, thumbnailImage))
    if (uploadThumbnailErr) return false
    return true
}

export default async function updatePlace(socket, data, io) {
    const { token, user } = socket.handshake.session
    const { id, updatedData } = data
    const [ retrieveErr, place ] = await to(retrieve(PLACE_KIND, id))
    if (retrieveErr) throwError(socket, events.PLACE_UPDATE_ERROR, errors.INTERNAL_ERROR)
    else {
        if (place.user != user && place.users.indexOf(user)<0) throwError(socket, events.PLACE_UPDATE_ERROR, errors.PERMISSION_DENIED)
        else {
            const isUploadSuccess = await updateThumbnail(updatedData)
            if (isUploadSuccess) {
                delete updatedData.thumbnail
                const [ updateErr, updatedPlace ] = await to(update(PLACE_KIND, id, updatedData))
                if (updateErr) throwError(socket, events.PLACE_UPDATE_ERROR, errors.INTERNAL_ERROR)
                else {
                    const [ resolveErr, placeWithUser ] = await to(resolveUserObject(token, updatedPlace))
                    if (resolveErr) throwError(socket, events.PLACE_UPDATE_ERROR, errors.UNAUTHORIZED)
                    else {
                        socket.emit(events.PLACE_UPDATE_SUCCESS, { place: placeWithUser })
                        io.sockets.emit(events.PLACE_DATA_UPDATE, { place: placeWithUser })
                    }
                }
            }
            else throwError(socket, events.PLACE_UPDATE_ERROR, errors.INTERNAL_ERROR)
        }
    }
}
