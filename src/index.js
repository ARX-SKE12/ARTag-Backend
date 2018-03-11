import AuthEvent from 'modules/auth'
import BodyParser from 'modules/body-parser'
import DotEnv from 'dotenv'
import Express from 'express'
import Http from 'http'
import PlaceEvent from 'modules/place'
import Session from 'modules/session'
import Socket from 'socket.io'

DotEnv.config()

const app = Express()
const server = Http.Server(app)
const io = Socket(server)

BodyParser(app)

Session(app, io)

const PORT = process.env.BACKEND_PORT

io.on('connection', socket => {
  
  const address = socket.handshake.address
  
  console.log(`${address} is connected.`)

  AuthEvent(socket)

  PlaceEvent(io, socket)

})

server.listen(PORT, err => {
  if (err) console.error(err)
  else console.log(`ARTag Backend service is listening on *:${PORT}`)
})
