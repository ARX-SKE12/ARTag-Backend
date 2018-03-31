import DotEnv from 'dotenv'

DotEnv.config()

export const EASYAR_HOST = process.env.EASYAR_HOST

export const EASYAR_SECRET = process.env.EASYAR_SECRET

export const EASYAR_APP_KEY = process.env.EASYAR_APP_KEY
