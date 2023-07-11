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

function sendStickerPositionData (id,posX,posY) {

}

function moveStickers (sticker) {
    if ($("#editMode").is(':checked')){
        sticker.children('.sticker-pin').addClass('unpinned')
        $(".workspace").mousemove(function(e) { 
            sticker.offset({ top: e.clientY-10, left: e.clientX-140})
        });
        sticker.on('click.second',(function(e){
            $(".workspace").off("mousemove") 
                sticker.children('.sticker-pin').removeClass('unpinned')
                sticker.off("click.second")
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
            // contents = contents.add(`<div class = "sticker-content-line">${elem.text}</div>`);
        })

        sticker.children(".sticker-content").append(
            contents
        )
        
        sticker.appendTo(".workspace-wrapper")
        
    });
}


$(document).ready(function(){

    renderStickers(stickers)

    $(".sticker").on('click',(function(e){
        moveStickers($(this))
    }))

    $(document).keydown(function(event) {
        var keyChar = String.fromCharCode(event.keyCode).toLowerCase();
        if (keyChar == "x" && event.ctrlKey) {
            $("#editMode").trigger("click")
        } else if (keyChar == "q" && event.ctrlKey) {
            $("#writeMode").trigger("click")
        } 
    });

    $(".sticker-content-line").on('click',(function(e){
       if ($("#writeMode").is(":checked")) {
        var text = prompt("Изменить надпись", e.target.innerHTML);
        if (text) {
            e.target.innerHTML=text
        }
    }
    }))

    $('.left-menu').on('click',(function(e){
        $(this).children(".left-menu-arrow").toggleClass('rotate')
    }))

    $(".left-menu").on('click',(function(){
        $(this).toggleClass("open")
    }))

    $("#login").on('click',(function(){
        $.ajax({
            url: "http://localhost:80/registration/",
            success: function(result){
                let response = result
               console.log(response);
            }
         });
    }))

     

})