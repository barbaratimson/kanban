const socket = io('ws://localhost:5000/', { transports: ['websocket', 'polling', 'flashsocket'] })

var connectionStatus = false
const stickers = [
    {
    id:1,
    position:{posX:220,posY:630},
    contents:[
    {id:1,text:"Todo"},{id:2,text:"Tododo"}
    ]
},
{
    id:2,
    position:{posX:348,posY:413},
    contents:[
    {id:1,text:"agugu"},{id:2,text:"agugugaga"}
    ]
},
{
    id:3,
    position:{posX:600,posY:620},
    contents:[
    {id:1,text:"TodoEEEEEE"},{id:2,text:"TododoAAAAAAAA"}
    ]
}
]
const user = {
    userId:window.localStorage.getItem("token"),
    username:"sergey",
    // roomId:`f${(+new Date).toString(16)}`
        roomId:123
}



socket.on('connect', () => {
   console.log("Connected")
   connectionStatus = true
   $(".connection-indicator").css("background-color","green")
})

socket.emit('joinRoom',user)

socket.on('editSticker', message => {
    serverEditStickers(message.stickerId,message.id,message.text,message.username)
})

socket.on('moveSticker', message => {
    serverMoveStickers(message.id,message.posX,message.posY)
})

socket.on('userConnected', message => {
    serverUserConnected(message.username)
})

socket.on('disconnect',()=> {
    connectionStatus = false
    $(".connection-indicator").css("background-color","red")
})

socket.on('error',()=> {
    connectionStatus = false
    $(".connection-indicator").css("background-color","red")
})


function sendStickerPositionData (id,posX,posY,username) {
    socket.emit("moveSticker",{id:id,posX:posX,posY:posY,username:username})
}

function serverMoveStickers (stickerId,posX,posY) {
    $(`div#${stickerId}.sticker`).offset({ top: posY-10, left: posX-140})
    }

function serverEditStickers (stickerId,textId,text) {
    $(`div#${stickerId}.sticker`).children(".sticker-content").children(`div#${textId}.sticker-content-line`).text(text)
}


function serverLogStickerChange (stickerId,username) {
    let content = $("<div>",{
        class:'user-username',
        css:{
            background:"#d897f9",
            color:"#e5c710",
            position:"absolute",
            bottom:"200px"

        }
    })  
        content.html(username,stickerId)


    $(".right-menu").append(content)

}

function serverUserConnected (username) {
    let content = $("<div>",{
        class:'user-username',
        css:{
            background:"#d897f9",
            color:"#e5c710",
            position:"absolute",
            bottom:"200px"

        }
    })  
        content.html(username)


    $(".right-menu").append(content)

}





function moveStickers (sticker,posX,posY) {
    if ($("#editMode").is(':checked') && connectionStatus){
        sticker.children('.sticker-pin').addClass('unpinned')
        $(".workspace").mousemove(function(e) { 
            posY = e.clientY-pageYOffset
            posX = e.clientX-pageXOffset
            sticker.offset({ top: posY-10, left: posX-140})
            sendStickerPositionData(sticker.attr('id'),posX,posY,user.username)
        });
        sticker.on('click.second',(function(e){
            $(".workspace").off("mousemove") 
                sticker.children('.sticker-pin').removeClass('unpinned')
                sticker.off("click.second")
                //POST к базе с позицией
        }))
    } 
}




function lostConnectionSyncDada () {
    
}

function renderStickers (stickers) {
    stickers.forEach(elem => {
        let contents = $()
        let sticker = $("<div>", {
            class: 'sticker',
            id:elem.id,
            css: {
                "position":"absolute",
                "left":`${elem.position.posX}px`,
                "top":`${elem.position.posY}px`
            }
        }).append($("<div>",{
            class: "sticker-pin pinned"
        }).append($(`<svg viewBox="0 0 24 24" fill="none">
        <path opacity="0.15" d="M17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8Z" fill="#000000"/>
        <path d="M12 13V21M12 13C14.7614 13 17 10.7614 17 8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8C7 10.7614 9.23858 13 12 13Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`)),$("<div>",{
            class: "sticker-content"
        })
        )

        elem.contents.forEach(elem => {
            let content = $("<div>",{
            class:'sticker-content-line',
            id:elem.id
        })  
            content.html(elem.text)
            contents = contents.add(content)
        })

        sticker.children(".sticker-content").append(
            contents
        )
        
        sticker.appendTo(".workspace-wrapper")
        
    });
}


$(document).ready(function(){
    console.log(window.localStorage.getItem("token"))
    $(".room-name").text(user.username + '`s room')
    renderStickers(stickers)

    $(".sticker").on('click',(function(e){
        moveStickers($(this))
    }))

    $(document).keydown(function(event) {
        var keyChar = String.fromCharCode(event.keyCode).toLowerCase();
        if (keyChar == "x" && event.ctrlKey && connectionStatus) {
            $("#editMode").trigger("click")
        } else if (keyChar == "q" && event.ctrlKey && connectionStatus) {
            $("#writeMode").trigger("click")
        } 
    });

    $(".sticker-content-line").on('click',(function(e){
        let sticker = $(e.target).attr('id')
        let parent = $(e.target).closest(".sticker").attr("id")
       if ($("#writeMode").is(":checked") && connectionStatus) {
        var text = prompt("Изменить надпись", e.target.innerHTML);
        if (text) {
            e.target.innerHTML=text
            const card = {id:sticker,stickerId:parent,text:text,username:user.username}
            socket.emit('editSticker',card)
        }   
    }
    }))





    $('.right-menu').on('click',(function(e){
        $(this).children(".right-menu-arrow").toggleClass('rotate')
    }))

    $(".right-menu").on('click',(function(){
        $(this).toggleClass("open")
    }))

    $("#login").on('click',(function(){

         $.get("http://localhost:80/",{name:"dsdsd"},function(data){
            console.log(JSON.parse(data))
         })
    })) 

     

})