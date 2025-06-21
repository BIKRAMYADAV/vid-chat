const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
dotenv.config()
const PORT = process.env.PORT
const {Server} = require('socket.io')
const app = express()

app.use(bodyParser.json());

const io = new Server()

app.listen(PORT, () => {
    console.log('The app is listening on port ', PORT);
})  
io.listen(process.env.SOCKET_PORT);