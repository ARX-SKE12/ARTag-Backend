import DotEnv from 'dotenv'

DotEnv.config()

export const SESSION_SECRET_KEY = process.env.SESSION_SECRET_KEY

export const REDIS_HOST = process.env.REDIS_HOST

export const REDIS_PORT = process.env.REDIS_PORT
