import { PLACE_KIND, THUMBNAIL_BUCKET } from 'modules/place/constants'
import { canTrack, createTarget, similar } from 'utils/cloud-recognition'
import { errors, throwError } from 'utils/error'

import { compressImage } from 'utils/image'
import { create } from 'utils/datastore'
import events from 'modules/place/events'
import { resolveSelfObject } from 'utils/user'
import to from 'await-to-js'
import { upload } from 'utils/storage'

async function initializePlaceObject(placeObject) {
    const [ compressThumbnailErr, thumbnail ] = await to(compressImage(placeObject.thumbnail, 800))
    if (!compressThumbnailErr) {
        const time = Date.now()
        const imageName = `${time}-${placeObject.name}.png`
        const [ uploadThumbnailErr ] = await to(upload(THUMBNAIL_BUCKET, imageName, thumbnail))
        if (!uploadThumbnailErr) {
            const [ compressMarkerErr, marker ] = await to(compressImage(placeObject.marker, 500))
            if (!compressMarkerErr) {
                const [ similarErr, isSimilar ] = await to(similar(marker))
                if (!similarErr && !isSimilar) {
                    const [ canTrackErr, shouldTrack ] = await to(canTrack(marker))
                    if (!canTrackErr && shouldTrack) {
                        const [ createTargetErr, targetId ] = await to(createTarget(imageName, marker, placeObject.marker.size))
                        if (!createTargetErr) {
                            const { name, description,isPublic, user } = placeObject
                            const placeData = {
                                name,
                                description,
                                isPublic,
                                thumbnail: imageName,
                                marker: targetId,
                                timestamp: time,
                                isActive: true,
                                planes: [],
                                users: [],
                                user
                            }
                            return placeData
                        }      
                    }
                }
            }
        }
    }
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
                const [ createErr ] = await to(create(PLACE_KIND, placeObject))
                if (createErr) throwError(socket, events.PLACE_CREATE_ERROR, errors.INTERNAL_ERROR)
                else {
                    socket.emit(events.PLACE_CREATE_SUCCESS)
                    io.sockets.emit(events.PLACE_DATA_UPDATE)
                }
            }
        }
    } else throwError(socket, events.PLACE_CREATE_ERROR, errors.TOKEN_LOST)
}
