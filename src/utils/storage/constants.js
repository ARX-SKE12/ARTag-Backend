import DotEnv from 'dotenv'

DotEnv.config()

export const PROJECT_ID = 'arx-ske'
export const KEYFILE = process.env.KEYFILE
export const BASE64_TYPE = 'base64'
export const PNG_TYPE = 'image/png'
export const MD5_TYPE = 'md5'
