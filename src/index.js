import AuthEvent from 'modules/auth'
import BodyParser from 'modules/body-parser'
import DotEnv from 'dotenv'
import Express from 'express'
import Http from 'http'
import PlaceEvent from 'modules/place'
import RoomEvent from 'modules/room'
import Session from 'modules/session'
import Socket from 'socket.io'

DotEnv.config()

const app = Express()
const server = Http.Server(app)

const PORT = process.env.BACKEND_PORT

server.listen(PORT, err => {
  if (err) console.error(err)
  else console.log(`ARTag Backend service is listening on *:${PORT}`)
})

const io = Socket(server)

BodyParser(app)

Session(app, io)

io.on('connection', socket => {
  
  const address = socket.handshake.address
  
  console.log(`${address} is connected.`)

  AuthEvent(socket)

  PlaceEvent(io, socket)

  RoomEvent(io, socket)

})
