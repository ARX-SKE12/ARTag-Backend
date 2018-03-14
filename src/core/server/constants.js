import DotEnv from 'dotenv'

DotEnv.config()

export const PORT = process.env.BACKEND_PORT
