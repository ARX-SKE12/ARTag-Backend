import DotEnv from 'dotenv'

DotEnv.config()

export const SESSION_SECRET_KEY = process.env.SESSION_SECRET_KEY

export const SESSION_PREFIX = 'express-session'

export const GC_PROJECT_ID = process.env.GCLOUD_PROJECT

export const GC_APP_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS
