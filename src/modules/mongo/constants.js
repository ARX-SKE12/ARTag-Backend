import DotEnv from 'dotenv'

DotEnv.config()

export const MONGO_URI = process.env.MONGO_URI
