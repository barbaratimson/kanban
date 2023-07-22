jQuery.extend({
    getUserData: function() {
        var result = null;
        $.ajax({
            url: "http://localhost/user",
            type: 'GET',
            async:false,
            headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` },
            success: function(data) {
                result = data;
            }
        });
       return result;
    }
});

jQuery.extend({
    getUserRoom: function() {
        var result = null;
        $.ajax({
            url: "http://localhost/room/get",
            method:"GET",
            async:false,
            headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` },
            success: function(data) {
                result = data;
            }
        });
       return result;
    }
});

jQuery.extend({
    getRoom: function(roomId) {
        var result = null;
        $.ajax({
            url: "http://localhost/room/get",
            method:"GET",
            async:false,
            data:{roomId:roomId},
            headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` },
            success: function(data) {
                result = data;
            }
        });
       return result;
    }
});

jQuery.extend({
    connectRoom: function(roomId,password) {
        var result = null;
        $.ajax({
            url: "http://localhost/room/connect",
            method:"GET",
            async:false,
            data:{roomId:roomId,password:password},
            headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` },
            success: function(data) {
                result = data;
            }
        });
       return result;
    }
});

jQuery.extend({
    getStickers: function(valid,roomId) {
        var result = null;
        $.ajax({
            url: "http://localhost/stickers",
            method:"GET",
            async:false,
            data:{valid:valid,roomId:roomId},
            headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` },
            success: function(data) {
                result = data;
            }
        });
       return result;
    }
});

jQuery.extend({
    createSticker: function(roomId,posX,posY) {
        var result = null;
        $.ajax({
            url: "http://localhost/stickers/create",
            method:"POST",
            async:false,
            data:JSON.stringify({roomId:roomId,posX:posX,posY:posY}),
            headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` },
            success: function(data) {
                result = data;
            }
        });
       return result;
    }
});

jQuery.extend({
    changeStickerPos: function(roomId,cardId,posX,posY) {
        var result = null;
        $.ajax({
            url: "http://localhost/stickers/update",
            method:"POST",
            async:false,
            data:JSON.stringify({roomId:roomId,cardId:cardId,posX:posX,posY:posY}),
            headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}`},
            success: function(data) {
                result = data;
            }
        });
       return result;
    }
});

jQuery.extend({
    changeStickerTitle: function(roomId,cardId,title) {
        var result = null;
        $.ajax({
            url: "http://localhost/stickers/update",
            method:"POST",
            async:false,
            data:JSON.stringify({roomId:roomId,cardId:cardId,title:title}),
            headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` },
            success: function(data) {
                result = data;
            }
        });
       return result;
    }
});

jQuery.extend({
    changeStickerText: function(roomId,cardId,text) {
        var result = null;
        $.ajax({
            url: "http://localhost/stickers/update",
            method:"POST",
            async:false,
            data:JSON.stringify({roomId:roomId,cardId:cardId,text,text}),
            headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` },
            success: function(data) {
                result = data;
            }
        });
       return result;
    }
});

jQuery.extend({
    deleteSticker: function(roomId,cardId) {
        var result = null;
        $.ajax({
            url: "http://localhost/stickers/delete",
            method:"POST",
            async:false,
            data:JSON.stringify({roomId:roomId,cardId:cardId}),
            headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` },
            success: function(data) {
                result = data;
            }
        });
       return result;
    }
});
