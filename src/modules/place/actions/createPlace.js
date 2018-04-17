import { BUCKET_ROOT, PLACE_KIND, QR_BUCKET, THUMBNAIL_BUCKET } from 'modules/place/constants'
import { errors, throwError } from 'utils/error'
import { resolveSelfObject, resolveUserObject } from 'utils/user'

import { Base64 } from 'js-base64'
import QR from 'qrcode'
import { compressImage } from 'utils/image'
import { create } from 'utils/datastore'
import events from 'modules/place/events'
import to from 'await-to-js'
import { upload } from 'utils/storage'

async function initializePlaceObject(placeObject) {
    const { name, description, isPublic, thumbnail, user } = placeObject
    const timestamp = Date.now().toString()
    const significant = `${timestamp}-${name}`
    const imageName = `${significant}.png`
    
    const [ compressThumbnailErr, thumbnailImage ] = await to(compressImage(thumbnail, 800))
    if (compressThumbnailErr) return null
    const [ uploadThumbnailErr ] = await to(upload(THUMBNAIL_BUCKET, imageName, thumbnailImage))
    if (uploadThumbnailErr) return null
    const encodedSignificant = Base64.encode(significant)
    const [ qrErr, qr ] = await to(QR.toDataURL(encodedSignificant))
    if (qrErr) return null
    const [ uploadQRErr ] = await to(upload(QR_BUCKET, imageName, qr))
    if (uploadQRErr) return null
    
    const data = {
        name, description, isPublic, user, timestamp,
        isActive: true,
        planes: [],
        origin: {
            x: 0,
            y: 0,
            z: 0
        },
        origin_rotation: {
            x: 0,
            y: 0,
            z: 0,
            w: 0
        },
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
                const [ createErr, place ] = await to(create(PLACE_KIND, placeObject).then(() => query(kind, {
                    filters: [{
                        field: 'timestamp',
                        op: '=',
                        value: placeObject.timestamp
                    }, {
                        field: 'name',
                        op: '=',
                        value: placeObject.name
                    }]
                })).catch(err => err).then(places => places[0][0]))
                if (createErr) throwError(socket, events.PLACE_CREATE_ERROR, errors.INTERNAL_ERROR)
                else {
                    const [ resolveUserErr, placeWithUserObj ] = await to(resolveUserObject(token, place))
                    if (resolveErr) throwError(socket, events.PLACE_CREATE_ERROR, errors.UNAUTHORIZED)
                    else {
                        socket.emit(events.PLACE_CREATE_SUCCESS, { place: placeWithUserObj })
                        io.sockets.emit(events.PLACE_DATA_UPDATE)
                    }
                }
            }
        }
    } else throwError(socket, events.PLACE_CREATE_ERROR, errors.TOKEN_LOST)
}
