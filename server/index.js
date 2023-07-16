const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const express = require('express')
const app = express()
const server = http.createServer(app)
const io = socketio(server);
const cors = require('cors')

const PORT = 5000

const users = [];

function getUser(id) {
    return users.find(user => user.id === id)
}

io.on('connection', socket => {
    socket.on('joinRoom',(client)=>{
        const user = {id:socket.id, userId:client.userId,username:client.username,room:client.roomId}
        users.push(user)
        socket.join(user.room)
        socket.in(user.room).emit("userConnected",user)
        console.log("User:", user, "-> connected")
        socket.on('editSticker', message => {
            console.log(message)
            socket.broadcast.to(user.room).emit("editSticker",message)
        })

        socket.on('moveSticker', message => {
            console.log(message)
            socket.broadcast.to(user.room).emit("moveSticker",message)
        })

        socket.on('disconnect', message => {
            console.log("User:",user,`-> disconnected: ${message}`)
            socket.broadcast.to(user.room).emit("userDisconnected",message)
        })
    })


    console.log(`User connected to socket`)
})


server.listen(PORT, ()=> console.log(`SERVER STARTED ON PORT ${PORT}`))