import DotEnv from 'dotenv'

DotEnv.config()

export const SESSION_SECRET_KEY = process.env.SESSION_SECRET_KEY

export const MONGO_URI = process.env.MONGO_URI