import ExpressApp from 'core/express-app'
import Http from 'http'
import { PORT } from 'core/server/constants'

const server = Http.Server(ExpressApp)

server.listen(PORT, err => {
    if (err) console.error(err)
    else console.log(`ARTag Backend service is listening on *:${PORT}`)
})

export default server