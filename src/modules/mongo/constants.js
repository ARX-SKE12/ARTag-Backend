import DotEnv from 'dotenv'

DotEnv.config()

export const MONGO_URI = process.env.MONGO_URI

export const DATABASE_NAME = process.env.DATABASE_NAME