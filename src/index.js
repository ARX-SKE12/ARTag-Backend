import Auth from 'modules/auth'
import BodyParser from 'body-parser'
import DotEnv from 'dotenv'
import Express from 'express'
import Http from 'http'
import MongoDB from 'mongodb'
import Session from 'modules/session'
import Socket from 'socket.io'
import store from 'modules/session/store'

DotEnv.config()

const app = Express()
const server = Http.Server(app)
const io = Socket(server)

app.use(BodyParser.json())
app.use(BodyParser.urlencoded({ extended: true }))

Session(app, io)

/*
const MongoClient = MongoDB.Client

const mongoURL = process.env.MONGO_URI*/
const PORT = process.env.BACKEND_PORT
/*
app.post('/admin/createdb', (req, res) => MongoClient.connect(mongoURL, (err, db) => {
    if (err) throw err
    console.log("Database created!")
    db.close()
  })
)*/

io.on('connection', socket => {
  console.log('a user conected')

  Auth(socket)

  socket.on('auth', auth_data => {
    socket.handshake.session.token = auth_data.token
    socket.handshake.session.client_id = auth_data.client_id
  })

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
