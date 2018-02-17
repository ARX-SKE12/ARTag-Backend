import Express from 'express'
import Http from 'http'
import MongoDB from 'mongodb'
import Socket from 'socket.io'

const app = Express()
const server = Http.Server(app)
const io = Socket(server)

const MongoClient = MongoDB.Client

const mongoURL = 'mongodb://localhost:27017/arxtest1'

app.get('/', function(req, res){
  res.sendFile(__dirname + '/frontend/index.html');
});

app.get('/old', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/test-fire', function(req, res){
  res.sendFile(__dirname + '/test-fire.html')
})

app.get('/tags', function(req, res){
  res.send(JSON.stringify(
    {
      name: 'test',
      description: 'funcking test'
    }
  ));
})

app.post('/admin/createdb', function(req, res){
  MongoClient.connect(mongoURL, function(err, db) {
    if (err) throw err;
    console.log("Database created!");
    db.close();
  });
})

// io.on('connection', function(socket){
//   console.log('a user connected');
//   socket.on('disconnect', function(){
//     console.log('user disconnected');
//   });
// });

// io.on('connection', function(socket){
//   socket.on('chat message', function(msg){
//     console.log('message: ' + msg);
//   });
// });

io.on('connection', function(socket){
  console.log('a user conected');
  socket.on('send-message', function(msg){
    console.log('a user send: ', msg);
    io.emit('forward-message', msg);
  });

  socket.on('MESH_DELIVERY', function(dict){
    console.log('mesh triangles:', dict.triangles);
    console.log('mesh uv:', dict.uv);
    console.log('mesh vertices:', dict.vertices);
    io.emit('INCOMING_MESH', dict);
  });

  socket.on('TAG_DELIVERY', function(tag){
    console.log(tag);
  });
});

// io.emit('some event', { for: 'everyone' });

function meshToString(mesh) {

}

server.listen(3000, function(){
  console.log('listening on *:3000');
});