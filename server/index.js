const expess = require('express')
const app = expess()
const WSServer= require("express-ws")(app)
const aWss = WSServer.getWss()

const PORT = 5000


app.ws('/',(ws,req)=>{
    console.log('Подключение установлено')
    ws.on('message',(msg) => {
        let message = JSON.parse(msg)
        switch (message.method) {
            case 'connection':
                console.log(`Пользователь ${message.username} с id:${message.userId} подключен`)
                break
            case 'stickerMove':
                broadcastConnection(ws,msg)
                break
            case 'stickerEdit':
                broadcastConnection(ws,msg)
            break
        }
        // console.log(JSON.parse(msg))
    })
})

const connectionHandler = (ws,msg) => {
    broadcastConnection(ws,msg)
}

const broadcastConnection = (ws,msg) => {
    aWss.clients.forEach(client => {
        if (client.id === msg.id){
            client.send(JSON.stringify(msg))
        }
    })
}

app.listen(PORT, ()=> console.log(`SERVER STARTED ON PORT ${PORT}`))