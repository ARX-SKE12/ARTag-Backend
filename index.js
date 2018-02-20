import BodyParser from 'body-parser'
import DotEnv from 'dotenv'
import Express from 'express'
import FBAuth from './modules/auth'
import Http from 'http'
import MongoDB from 'mongodb'
import Request from 'request'
import Session from './modules/session'
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
  console.log(`graph.facebook.com/${req.user.profile.id}?access_token=${req.session.token}`)
  Request.get(`https://graph.facebook.com/${req.user.profile.id}?access_token=${req.session.token}`, (err, res, body) => console.log(res.body))
  res.send(req.user)
})

io.use((socket, next) => Session(socket.request, {}, next))
io.on('connection', socket => {
  console.log('a user conected')
  socket.on('send-message', msg => {
    console.log(socket.req.user)
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