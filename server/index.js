const http = require('http')
const socketio = require('socket.io')
const express = require('express')
const app = express()
const server = http.createServer(app)
const io = socketio(server);

const PORT = 5000

const users = [];

function getUser(id) {
    return users.find(user => user.id === id)
}

io.on('connection', socket => {
    socket.on('joinRoom',(client)=>{
        const user = {id:socket.id,userId:client.id,username:client.username,room:client.roomId}
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

        socket.on('newSticker', message => {
            console.log(message)
            socket.broadcast.to(user.room).emit("newSticker",message)
        })

        socket.on('titleSticker', message => {
            console.log(message)
            socket.broadcast.to(user.room).emit("titleSticker",message)
        })

        socket.on('textSticker', message => {
            console.log(message)
            socket.broadcast.to(user.room).emit("textSticker",message)
        })

        socket.on('deleteSticker', message => {
            console.log(message)
            socket.broadcast.to(user.room).emit("deleteSticker",message)
        })


        socket.on('disconnect', message => {
            console.log("User:",user,`-> disconnected: ${message}`)
            socket.broadcast.to(user.room).emit("userDisconnected",message)
        })
    })


    console.log(`User connected to socket`)
})


server.listen(PORT, ()=> console.log(`SERVER STARTED ON PORT ${PORT}`))