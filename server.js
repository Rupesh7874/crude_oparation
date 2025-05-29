const express = require('express');
const { createServer } = require("http");
const { join } = require('path');
const { Server } = require("socket.io");
const conectdb = require('./confige/db');
const passport = require('passport')
var session = require('express-session');
const passportjwt = require('./confige/auth');
const { options } = require('./routs/userrouts');
const app = express();

conectdb();

app.use(express.json());
app.use(express.urlencoded({ extends: true }))

const server = createServer(app);
const io = new Server(server);


io.on('connection', (socket) => {
  console.log('a user connected');

  socket.emit('hello', { message: 'Hello from server!' });
 
  socket.on('message', (data) => {
    console.log('Message received from client:', data);
    socket.emit('response', { message: `Server received: ${JSON.stringify(data)}` });
  });
});


app.use('/api/user', require('./routs/userrouts'))

const port = 8888;

server.listen(port, (err) => {
  console.log("server running sucessfully on port", port);

})