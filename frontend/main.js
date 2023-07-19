

var connectionStatus = false
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

let user = $.getUserData()
if (!user.username) {
    window.location.assign("./lobby.html")
}
let roomId = getUrlVars().roomId
user.roomId = roomId
// let password = prompt("password")
let password = 123
let roomConnect = $.connectRoom(roomId,password).valid
if (roomConnect === false){
    window.location.assign("./lobby.html")
}

renderStickers($.getStickers(roomConnect,roomId).stickers)
const socket = io('ws://localhost:5000/', { transports: ['websocket', 'polling', 'flashsocket'] })

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

socket.on('newSticker', message => {
    window.location.reload();
})

socket.on('titleSticker', message => {
    serverChangeTitleStickers(message.id,message.text)
})

socket.on('textSticker', message => {
    serverChangeTextStickers(message.id,message.text)
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
    console.log(stickerId)
    $(`div#${stickerId}.sticker`).offset({ top: posY, left: posX})
    }

function serverEditStickers (stickerId,textId,text) {
    $(`div#${stickerId}.sticker`).children(".sticker-content").children(`div#${textId}.sticker-content-line`).text(text)
}

function serverChangeTitleStickers (stickerId,title) {
    $(`div#${stickerId}.sticker`).children(".sticker-content").children(".sticker-title").val(title)
}

function serverChangeTextStickers (stickerId,text) {
    $(`div#${stickerId}.sticker`).children(".sticker-content").children(".sticker-text").val(text)
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
            posY = e.clientY-pageYOffset-10
            posX = e.clientX-pageXOffset-140
            sticker.offset({ top: posY, left: posX})
            sendStickerPositionData(sticker.attr('id'),posX,posY,user.username)
        });
        sticker.on('click.second',(function(e){
            $(".workspace").off("mousemove") 
                sticker.children('.sticker-pin').removeClass('unpinned')
                sticker.off("click.second")
                $.changeStickerPos(roomId,sticker.attr('id'),posX,posY)
        }))
    } 
}



function createSticker (stickers) {
    let sticker = $("<div>", {
        class: 'sticker',
        id:stickers.id,
        css: {
            "position":"absolute",
            "left":`${stickers.posX}px`,
            "top":`${stickers.posY}px`
        }
    }).append($("<div>",{
        class: "sticker-pin pinned"
    }).append($(`<svg viewBox="0 0 24 24" fill="none">
    <path opacity="0.15" d="M17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8Z" fill="#000000"/>
    <path d="M12 13V21M12 13C14.7614 13 17 10.7614 17 8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8C7 10.7614 9.23858 13 12 13Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`)),$("<div>",{
        class: "sticker-content"
    }).append($(`<input class = "sticker-title">`),$(`<input class = "sticker-text">)`))
    ).append($(`<button class = "sticker-save">Save</button>`),(`<button class = "sticker-delete">Delete</button>`))

    sticker.appendTo(".workspace-wrapper")
        sticker.on('click',(function(e){
            moveStickers($(this))
        }))


}

function renderStickers (stickers) {
    stickers.forEach(elem => {
        let sticker = $("<div>", {
            class: 'sticker',
            id:elem.id,
            css: {
                "position":"absolute",
                "left":`${elem.posX}px`,
                "top":`${elem.posY}px`
            }
        }).append($("<div>",{
            class: "sticker-pin pinned"
        }).append($(`<svg viewBox="0 0 24 24" fill="none">
        <path opacity="0.15" d="M17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8Z" fill="#000000"/>
        <path d="M12 13V21M12 13C14.7614 13 17 10.7614 17 8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8C7 10.7614 9.23858 13 12 13Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`)),$("<div>",{
            class: "sticker-content"
        }).append($(`<input value = "${elem.title}" class = "sticker-title">`),$(`<textarea class = "sticker-text" rows="5" cols="80">${elem.text}</textarea>`))
        ).append($("<div>",{
            class: "sticker-footer"
        }).append($(`<button class = "sticker-save">Save</button>`),(`<button class = "sticker-delete">Delete</button>`)))

        sticker.appendTo(".workspace-wrapper")
    });
}


$(document).ready(function(){
    console.log(window.localStorage.getItem("token"))
    $(".room-name").text(user.username + '`s room')

    
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

    $("#debug").on('click',function(){
        localStorage.clear()
    })

    
    $(".create-sticker").on('click',(function(e){
        let sticker = $.createSticker(roomId,30,80)
        if (sticker) {
        createSticker(roomId,30,80)
        socket.emit("newSticker")
        }
        window.location.reload();
    }))
        $(".sticker-title").on('input',(function(e){
            let field = $(e.target).attr('id')
            let parent = $(e.target).closest(".sticker").attr("id")
                let input = e.target.value
                socket.emit("titleSticker",{id:parent,text:input,username:user.username})
        }))
    
        $(".sticker-text").on('input',(function(e){
            let parent = $(e.target).closest(".sticker").attr("id")
           if (connectionStatus) {
                let input = e.target.value
                socket.emit("textSticker",{id:parent,text:input,username:user.username})
        }
        }))


        $(".sticker-save").on('click',(function(e){
            let parent = $(e.target).closest(".sticker")
            let fieldTitle = parent.children(".sticker-content").children(".sticker-title").val()
            let fieldText = parent.children(".sticker-content").children(".sticker-text").val()
            console.log(fieldText)
            let parentId = parent.attr("id")
           if (connectionStatus) {
                $.changeStickerTitle(roomId,parentId,fieldTitle)
                $.changeStickerText(roomId,parentId,fieldText)
                
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