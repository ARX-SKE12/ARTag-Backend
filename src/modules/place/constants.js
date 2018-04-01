import DotEnv from 'dotenv'

DotEnv.config()

export const PLACE_KIND = 'Place'
export const THUMBNAIL_BUCKET = process.env.THUMBNAIL_BUCKET
export const MARKER_BUCKET = process.env.MARKER_BUCKET
export const BUCKET_ROOT = process.env.BUCKET_ROOT
