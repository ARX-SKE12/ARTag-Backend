import BodyParser from 'body-parser'

export default app => {
    app.use(BodyParser.json())
    app.use(BodyParser.urlencoded({ extended: true }))
}
