import { BUCKET_ROOT, MARKER_BUCKET, PLACE_KIND, THUMBNAIL_BUCKET } from 'modules/place/constants'
import { errors, throwError } from 'utils/error'

import { compressImage } from 'utils/image'
import { create } from 'utils/datastore'
import { createTarget } from 'utils/cloud-recognition'
import events from 'modules/place/events'
import { resolveSelfObject } from 'utils/user'
import to from 'await-to-js'
import { upload } from 'utils/storage'

async function initializePlaceObject(placeObject) {
    const { name, description, isPublic, marker, thumbnail, user } = placeObject
    const timestamp = Date.now()
    const imageName = `${timestamp}-${name}.png`
    
    const [ compressThumbnailErr, thumbnailImage ] = await to(compressImage(thumbnail, 800))
    if (compressThumbnailErr) return null
    const [ uploadThumbnailErr ] = await to(upload(THUMBNAIL_BUCKET, imageName, thumbnailImage))
    if (uploadThumbnailErr) return null
    
    const [ compressMarkerErr, markerImage ] = await to(compressImage(marker, 500))
    if (compressMarkerErr) return null
    const [ uploadMarkerErr ] = await to(upload(MARKER_BUCKET, imageName, markerImage))
    if (uploadMarkerErr) return null
    const markerLocation = `${BUCKET_ROOT}/${MARKER_BUCKET}/${imageName}`
    const [ createMarkerErr, markerTarget ] = await to(createTarget(imageName, markerLocation, marker.size))
    console.log(createMarkerErr)
    console.log('target'+markerTarget)
    if (createMarkerErr) return null

    const data = {
        name, description, isPublic, user, timestamp,
        isActive: true,
        planes: [],
        users: [],
        marker: markerTarget.id
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
                const [ createErr, placeId ] = await to(create(PLACE_KIND, placeObject))
                if (createErr) throwError(socket, events.PLACE_CREATE_ERROR, errors.INTERNAL_ERROR)
                else {
                    socket.emit(events.PLACE_CREATE_SUCCESS, { placeId })
                    io.sockets.emit(events.PLACE_DATA_UPDATE)
                }
            }
        }
    } else throwError(socket, events.PLACE_CREATE_ERROR, errors.TOKEN_LOST)
}
