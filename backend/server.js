const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
dotenv.config()
const PORT = process.env.PORT
const {Server} = require('socket.io')
const app = express()

app.use(bodyParser.json());

const io = new Server()

const emailToSocket = new Map();

io.on('connection', (socket) => {
    console.log('new connection')
    socket.on('join-room', (data) => {
        const {roomId, emailId} = data;
        console.log("user ",emailId, " joined room no : ",roomId);
        emailToSocket.set(emailId, socket.id);
        socket.join(roomId)
        socket.broadcast.to(roomId).emit("user-joined", {emailId});
    })
})

app.listen(PORT, () => {
    console.log('The app is listening on port ', PORT);
})  
io.listen(process.env.SOCKET_PORT);