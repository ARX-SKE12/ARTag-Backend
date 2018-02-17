import DotEnv from 'dotenv'
import Express from 'express'
import Http from 'http'
import MongoDB from 'mongodb'
import Socket from 'socket.io'

DotEnv.config()
console.log(process.env)
const app = Express()
const server = Http.Server(app)
const io = Socket(server)

const MongoClient = MongoDB.Client

const mongoURL = 'mongodb://localhost:27017/arxtest1'

app.post('/admin/createdb', (req, res) => MongoClient.connect(mongoURL, (err, db) => {
    if (err) throw err
    console.log("Database created!")
    db.close()
  })
)

io.on('connection', socket => {
  console.log('a user conected')
  socket.on('send-message', msg => {
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

server.listen(3000, err => {
  console.log('listening on *:3000')
})