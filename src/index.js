import BodyParser from 'body-parser'
import DotEnv from 'dotenv'
import Express from 'express'
import FB from 'modules/facebook'
import FBAuth from 'modules/auth'
import Http from 'http'
import MongoDB from 'mongodb'
import Session from 'modules/session'
import Socket from 'socket.io'

DotEnv.config()

const app = Express()
const server = Http.Server(app)
const io = Socket(server)

app.use(BodyParser.json())

app.use(Session)

app.use(FBAuth.initialize())
app.use(FBAuth.session())

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
app.post('/auth/facebook/token', FBAuth.authenticate('facebook-token'), (req, res) => {
  req.session.token = req.body.access_token
  FB.getUser(req.session.token,req.user.profile.id, (err, res) => console.log(res) )
  res.send(req.user)
})

io.use((socket, next) => Session(socket.request, {}, next))
io.on('connection', socket => {
  console.log('a user conected')
  socket.on('send-message', msg => {
    console.log(socket.req.user)
    console.log(socket.request.session)
    console.log('a user send: ', msg)
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