import { BUCKET_ROOT, PLACE_KIND, QR_BUCKET, THUMBNAIL_BUCKET } from 'modules/place/constants'
import { errors, throwError } from 'utils/error'

import QR from 'yaqrcode'
import base64 from 'base-64'
import { compressImage } from 'utils/image'
import { create } from 'utils/datastore'
import events from 'modules/place/events'
import { resolveSelfObject } from 'utils/user'
import to from 'await-to-js'
import { upload } from 'utils/storage'

async function initializePlaceObject(placeObject) {
    const { name, description, isPublic, thumbnail, user } = placeObject
    const timestamp = Date.now()
    const significant = `${timestamp}-${name}`
    const imageName = `${significant}.png`
    
    const [ compressThumbnailErr, thumbnailImage ] = await to(compressImage(thumbnail, 800))
    if (compressThumbnailErr) return null
    const [ uploadThumbnailErr ] = await to(upload(THUMBNAIL_BUCKET, imageName, thumbnailImage))
    if (uploadThumbnailErr) return null

    const qr = QR(significant, { size: 500 })
    const [ uploadQRErr ] = await to(upload(QR_BUCKET, imageName, qr))
    if (uploadQRErr) return null
    
    const data = {
        name, description, isPublic, user, timestamp,
        isActive: true,
        planes: [],
        users: []
    }
    return data
}

export default async function createPlace(socket, placeData, io) {
    const { token } = socket.handshake.session
    if (token) {
        const [ resolveErr, placeWithUser ] = await to(resolveSelfObject(token, placeData))
        if (resolveErr) throwError(socket, events.PLACE_CREATE_ERROR, errors.UNAUTHORIZED)
        else {
            const placeObject = await initializePlaceObject(placeWithUser)
            if (!placeObject) throwError(socket, events.PLACE_CREATE_ERROR, errors.INTERNAL_ERROR)
            else {
                const [ createErr, place ] = await to(create(PLACE_KIND, placeObject))
                if (createErr) throwError(socket, events.PLACE_CREATE_ERROR, errors.INTERNAL_ERROR)
                else {
                    socket.emit(events.PLACE_CREATE_SUCCESS, { place })
                    io.sockets.emit(events.PLACE_DATA_UPDATE)
                }
            }
        }
    } else throwError(socket, events.PLACE_CREATE_ERROR, errors.TOKEN_LOST)
}
