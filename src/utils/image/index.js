import { BASE64_TYPE } from 'utils/image/constants'
import Sharp from 'sharp'

export function compressImage(data, expectWidth) {
    const { image, width, height } = data
    const buffer = Buffer.from(image, BASE64_TYPE)
    return Sharp(buffer)
                .resize(expectWidth)
                .toBuffer()
                .then(data => Buffer.from(data).toString(BASE64_TYPE))
                .catch(err => err)
}
