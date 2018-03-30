import { PLACE_KIND, THUMBNAIL_BUCKET } from 'modules/place/constants'
import { errors, throwError } from 'utils/error'

import { compressImage } from 'utils/image'
import { create } from 'utils/datastore'
import events from 'modules/place/events'
import { resolveSelfObject } from 'utils/user'
import to from 'await-to-js'
import { upload } from 'utils/storage'

async function initializePlaceObject(placeObject) {
    // placeObject.is_active = true
    // placeObject.timestamp = Date.now()
    // placeObject.meshes = []
    // placeObject.tags = []
    // return placeObject
    const [ compressErr, thumbnail ] = await to(compressImage(placeObject.thumbnail, 450, 800))
    if (compressErr) throw 'Image Compression Error'
    else {
        const time = Date.now()
        const imageName = `${time}-${placeObject.name}.png`
        const [ uploadErr ] = await to(upload(THUMBNAIL_BUCKET, imageName, thumbnail))
        if (uploadErr) throw 'Upload Error'
        else {
            
        }
    }
}

export default async function createPlace(socket, placeData, io) {
    const { token } = socket.handshake.session
    initializePlaceObject(placeData)
    // console.log(placeData.thumbnail)
    // console.log(placeData.thumbnail.length)
    // if (token) {
    //     const [ resolveErr, placeWithUser ] = await to(resolveSelfObject(token, placeData))
    //     if (resolveErr) throwError(socket, events.PLACE_CREATE_ERROR, errors.UNAUTHORIZED)
    //     else {
    //         const [ createErr ] = await to(create(PLACE_KIND, initializePlaceObject(placeWithUser)))
    //         if (createErr) throwError(socket, events.PLACE_CREATE_ERROR, errors.INTERNAL_ERROR)
    //         else {
    //             socket.emit(events.PLACE_CREATE_SUCCESS)
    //             io.sockets.emit(events.PLACE_DATA_UPDATE)
    //         }
    //     }
    // } else throwError(socket, events.PLACE_CREATE_ERROR, errors.TOKEN_LOST)
}
