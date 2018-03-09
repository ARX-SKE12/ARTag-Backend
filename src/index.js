import Auth from 'modules/auth'
import BodyParser from 'modules/body-parser'
import DotEnv from 'dotenv'
import Express from 'express'
import Http from 'http'
import MongoDB from 'mongodb'
import Place from 'modules/place'
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
  console.log('a user conected')

  Auth(socket)

  Place(socket)

  socket.on('send-message', msg => {
    console.log(socket.handshake.address)
    console.log('ss',socket.handshake.session)
    io.emit('forward-message', msg)
  })

  socket.on('MESH_DELIVERY', dict => {
    console.log('mesh triangles:', dict.triangles)
    console.log('mesh uv:', dict.uv)
    console.log('mesh vertices:', dict.vertices)
    io.emit('INCOMING_MESH', dict)
  })

  socket.on('TAG_DELIVERY', tag => {
    console.log(tag)
  })
})

function meshToString(mesh) {

}

server.listen(PORT, err => {
  console.log(`listening on *:${PORT}`)
})
