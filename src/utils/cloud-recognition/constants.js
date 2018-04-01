import DotEnv from 'dotenv'

DotEnv.config()

const { WIKITUDE_API_HOST, ARTAG_WIKITUDE_COLLECTION } = process.env

export const { WIKITUDE_TOKEN } = process.env

export const WIKITUDE_COLLECTION_API_ROOT = `${WIKITUDE_API_HOST}/cloudrecognition/targetCollection/${ARTAG_WIKITUDE_COLLECTION}`