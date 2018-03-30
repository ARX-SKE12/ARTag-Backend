import { BASE64_TYPE, KEYFILE, MD5, PNG_TYPE, PROJECT_ID } from 'utils/storage/constants'

import BlueBird from 'bluebird'
import Storage from '@google-cloud/storage'

const PromiseStorage = BlueBird.promisifyAll(Storage)

const storage = PromiseStorage({ projectId: PROJECT_ID, keyFilename: KEYFILE })

export function upload(bucketName, imageName, imageData) {
    const imageBuffer = new Buffer(imageData, BASE64_TYPE)
    const bucket = storage.bucket(bucketName)
    const file = bucket.file(imageName)
    return file.saveAsync(imageBuffer, {
        metadata: {
            contentType: PNG_TYPE
        },
        public: true,
        validation: MD5
    })
}

