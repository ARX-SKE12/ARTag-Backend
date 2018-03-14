import BodyParser from 'core/body-parser'
import Express from 'express'

const app = Express()

BodyParser(app)

export default app