const express = require('express');
const path = require('path');
const cors = require('cors');
const port = 3000;
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const sassMiddleware = require('node-sass-middleware');
var session = require('express-session');
var flash = require('connect-flash');
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


/* View engine setup */ 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(flash());
app.use(session({secret: 'mySecret', 
  resave: true, 
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
  }));
/* SASS middleware that takes our SCSS file and convert it to a CSS file */ 
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false // true = .sass and false = .scss
}));

app.use(express.static(path.join(__dirname, 'public')));

/* Import client routes */ 

/* Setting client to use our routes */ 
var IndexRouter = require('./routes/index');
var LoginRouter = require('./routes/login');
var RegisterRouter = require('./routes/register');
var ChatRouter = require('./routes/chat');
var ProfileRouter = require('./routes/profile');
// var CreateChannelRouter = require('./routes/createChannel');
// var CreateDirectMessageRouter = require('./routes/createDirectMessage');


/* Setting client to use our routes */ 
app.use('/', IndexRouter);
app.use('/chat', ChatRouter);
app.use('/login', LoginRouter);
app.use('/register', RegisterRouter);
app.use('/',ProfileRouter);
// app.use('/chat/new-directMessage', CreateDirectMessageRouter);

// var allUsernameIDS = {};
var usernameIDS = {};
var users;
io.on('connection', function (socket) {
  var currentChannel, username, nrOfUsers, socketID;
  let clientList;
  socket.on('reset_users_channel', (data) => {
    users = [];
    usernameIDS[data.socketID] = data.username;
    Object.keys(socket.rooms).forEach(function(roomName){
      if(io.sockets.adapter.rooms[roomName]){
        socket.leave(roomName)
        if (io.sockets.adapter.rooms[roomName]){
          nrOfUsers = io.sockets.adapter.rooms[roomName].length;
          clientList = Object.keys(io.sockets.adapter.rooms[roomName].sockets) 
          for(let x = 0; x < nrOfUsers; x++){
            users.push(usernameIDS[clientList[x]])
          }
          io.in(roomName).emit('numberOfUsers', {numberOfUsers: nrOfUsers, memberList: users})
        }
      }
    });
  });

  socket.on('join_channel', (data) => {
    currentChannel = data.channelID
    socket.join(currentChannel);
    if (io.sockets.adapter.rooms[currentChannel]){
      nrOfUsers = io.sockets.adapter.rooms[currentChannel].length;
      clientList = Object.keys(io.sockets.adapter.rooms[currentChannel].sockets) 
      for(let x = 0; x < nrOfUsers; x++){
        users.push(usernameIDS[clientList[x]])
      }
      io.in(currentChannel).emit('numberOfUsers', {numberOfUsers: nrOfUsers, memberList: users})
    }
  });
  socket.on('set_username', (username) => {
    socket.username = username;
  });

  socket.on('create_directMessage', (data) => {
    currentChannel = data.channelID
    socket.join(currentChannel);
    var sockets = io.sockets.sockets;
    for(var socketId in sockets) {
      var s = sockets[socketId]; 
      if(s.username == data.targetUsername){ 
        s.join(currentChannel);
      }
    }
    io.in(currentChannel).emit('add_directMessage', {targetUsername: data.targetUsername, targetID: data.targetID, username: data.username});
  });

  socket.on('create_message', (data) => {
    io.in(data.channelID).emit('send_message', {username: data.username, time: data.time, text: data.text, msgID: data.msgID})
  })

  socket.on('update_message', (data) => {
    io.in(data.channelID).emit('change_message', {newMessage: data.message, editMsgID: data.editMsgID})
  });

  socket.on('delete_message', (data) => {
    io.in(data.channelID).emit('remove_message', {messageID: data.messageID})
  });
  
  socket.on('someone_typing', (data) => {
    socket.to(data.channelID).emit('display_typing', {username: data.username, enteredValue: data.enteredValue})
  })
});


http.listen(port, () => console.log(`Client listening on port ${port}!`));


module.exports = app;
