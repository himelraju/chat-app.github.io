const express = require("express")
const { v4: uuidv4 } = require('uuid');
const port = process.env.PORT || 80
const path = require('path')
const app = express();
const server = require('http').createServer(app)
const socketIO = require('socket.io');
const io = socketIO(server)
require('./globals.js');
app.use(express.static(path.join(__dirname, 'puplic')))

// ============ Application =================
io.on('connection', socket =>{
  onlineUsers.push(socket)
  let windowID = socket.id

  socket.on('findStr', ()=>{
      availableUsers.push(socket)
      let unfilledRooms = rooms.filter((room) => {
        if (!room.isFilled) {
          return room;
        }
      });
      try {
        // join the existing room.
          socket.join(unfilledRooms[0].roomID);
          let index = rooms.indexOf(unfilledRooms[0]);
          rooms[index].isFilled = true;
          unfilledRooms[0].isFilled = true;
          socket.emit('canWriteNow', { 'message':"You are Added to privateRoom" } );
          socket.roomID = unfilledRooms[0].roomID;
          io.sockets.in(socket.roomID).emit('toast', { "message": "You are connected with a stranger!"});
          index = availableUsers.indexOf(socket)
          availableUsers.splice(index, 1)
      }catch(e) {
        // dont have unfilled rooms. Thus creating a new user.
        let uID = uuidv4()
        rooms.push({ "roomID": uID, "isFilled": false });
        socket.join(uID);
        socket.roomID = uID;
        socket.emit('canWriteNow', {'message':"Please wait...connecting you to stranger"} );
      }
  })
  socket.on('toServerMsg', (data)=>{
    io.to(socket.roomID).emit('viewMsg', data, windowID)
  });


  // when user click on leave button 
    socket.on('leave', ()=>{
    roomIndex = rooms.findIndex(x => x.roomID === socket.roomID);

    rooms.splice(roomIndex, 1)
      io.sockets.in(socket.roomID).emit('leave', {'message':"User is disconnect"} );
  })


  // disConnection
  socket.on('disconnect',  ()=>{
    
    function disconnect(usersType){
      let index = usersType.indexOf(socket)
      usersType.splice(index, 1)
    }
    disconnect(availableUsers)
    disconnect(onlineUsers)
    roomIndex = rooms.findIndex(x => x.roomID === socket.roomID);
    io.sockets.in(socket.roomID).emit('leave', {'message':"User is disconnect"} );
    rooms.splice(roomIndex, 1)
  });
  })
// end connection block


app.get("/", (req,res) => {
  res.sendFile(path.join(__dirname, 'app' , 'index.html'))
})
app.get("/chat", (req,res) => {
  res.sendFile(path.join(__dirname, 'app' , 'chat.html'))
})


server.listen(port, () => console.log('server is connect'))
