const http = require('http')
const socketio = require('socket.io')
const express = require('express')
const app = express()
const server = http.createServer(app)
const io = socketio(server);

const PORT = 5000

const users = [];

function getUsers(roomId) {
    return users.filter(user => user.room === roomId)
}
function getUser(userId) {
    return users.find(user => user.userId === userId)
}

function deleteUser(userId) {
    let user = users.find(user => user.userId === userId)
    let userIndex = users.indexOf(user)
    users.splice(userIndex,1)
}

io.on('connection', socket => {
    socket.on('joinRoom',(client)=>{
        const user = {id:socket.id,userId:client.id,username:client.username,room:client.roomId}

        if (getUser(user.userId) === undefined){
        users.push(user)
        }
        
        socket.join(user.room)
        socket.emit("userConnected",getUsers(user.room))
        socket.in(user.room).emit("userConnected",getUsers(user.room))
        socket.broadcast.to(user.room).emit("chatMessage",{message:"Connected",user})
        socket.emit("chatMessage",{message:"Connected",user})
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

        socket.on('chatMessage', message => {
            console.log(message)
            socket.emit("chatMessage",message)
            socket.broadcast.to(user.room).emit("chatMessage",message)
        })


        socket.on('disconnect', message => {
            console.log("User:",user,`-> disconnected: ${message}`)
            deleteUser(user.userId)
            socket.broadcast.to(user.room).emit("userDisconnected",getUsers(user.room))
            socket.broadcast.to(user.room).emit("chatMessage",{message:"Disconnected",user})
        })

    })

})


server.listen(PORT, ()=> console.log(`SERVER STARTED ON PORT ${PORT}`))