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
const io = new Server(server,{
   cors: {
    origin: '*',
  }
});


io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
  socket.emit(`welcome','Hello from server!,${socket.id}`);

  socket.on("message", (message) => {
    console.log(message, socket.id);

  })

  socket.on('disconnecting', () => {
    console.log("user disconnect");
  })

});


app.use('/api/user', require('./routs/userrouts'))

const port = 8888;

server.listen(port, (err) => {
  console.log("server running sucessfully on port", port);

})