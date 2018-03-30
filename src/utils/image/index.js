import { BASE64_TYPE } from 'utils/image/constants'
import Sharp from 'sharp'

export function compressImage(data, expectHeight, expectWidth) {
    const { image, width, height } = data
    const buffer = Buffer.from(image, BASE64_TYPE)
    return Sharp(buffer)
                .resize(expectWidth, expectHeight)
                .toBuffer()
                .then(data => Buffer.from(data).toString(BASE64_TYPE))
                .catch(err => err)
}
