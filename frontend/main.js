function getUrlVars() {
  var vars = [],
    hash;
  var hashes = window.location.href
    .slice(window.location.href.indexOf("?") + 1)
    .split("&");
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split("=");
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}

const roomId = getUrlVars().roomId;
let user = $.getUserData();
var connectionStatus = false;
const password = localStorage.getItem("roomPassword");
let roomConnect = $.connectRoom(roomId, password);
const roomOwner = $.getRoomOwner(roomId);


if (user && !user.username) {
  window.location.assign("./login.html");
} else if (!user) {
  window.location.assign("./error.html");
}

if (roomId) {
  user.roomId = roomId;
  $("#roomId").val(roomId);
}

if (roomConnect && roomConnect.valid === false) {
  window.location.assign("./lobby.html");
} else {
  roomConnect = roomConnect.valid;
  renderStickers($.getStickers(roomConnect, roomId).stickers);
}

// const socket = io("wss://5000-barbaratimson-kanban-he1ofh6c1pm.ws-eu102.gitpod.io/", {
//   transports: ["websocket", "polling", "flashsocket"],
// });

const socket = io("ws://localhost:5000/", {
  transports: ["websocket", "polling", "flashsocket"],
});

socket.on("connect", (message) => {
  connectionStatus = true;
  $(".connection-indicator").css("background-color", "green");
});

socket.emit("joinRoom", user);

socket.on("editSticker", (message) => {
  serverEditStickers(
    message.stickerId,
    message.id,
    message.text,
    message.username,
  );
});

socket.on("moveSticker", (message) => {
  serverMoveStickers(message.id, message.posX, message.posY);
});

socket.on("newSticker", (message) => {
  window.location.reload();
});

socket.on("titleSticker", (message) => {
  serverChangeTitleStickers(message.id, message.text);
});

socket.on("textSticker", (message) => {
  serverChangeTextStickers(message.id, message.text);
});

socket.on("deleteSticker", (message) => {
  window.location.reload();
});

socket.on("userConnected", (message) => {
  serverUsersUpdate(message);
});

socket.on("userDisconnected", (message) => {
  serverUsersUpdate(message);
});

socket.on("chatMessage", (message) => {
  serverChatMessage(message);
});

socket.on("disconnect", () => {
  connectionStatus = false;
  localStorage.removeItem("roomPassword");
  socket.close();
  $(".connection-indicator").css("background-color", "red");
});

socket.on("error", () => {
  connectionStatus = false;
  $(".connection-indicator").css("background-color", "red");
});

function sendStickerPositionData(id, posX, posY, username) {
  if (connectionStatus) {
    socket.emit("moveSticker", {
      id: id,
      posX: posX,
      posY: posY,
      username: username,
    });
  }
}

function serverMoveStickers(stickerId, posX, posY) {
  $(`div#${stickerId}.sticker`).offset({ top: posY, left: posX });
}

function serverEditStickers(stickerId, textId, text) {
  $(`div#${stickerId}.sticker`)
    .children(".sticker-content")
    .children(`div#${textId}.sticker-content-line`)
    .text(text);
}

function serverChangeTitleStickers(stickerId, title) {
  $(`div#${stickerId}.sticker`)
    .children(".sticker-content")
    .children(".sticker-title")
    .val(title);
    console.log( $(`div#${stickerId}.sticker`)
    .children(".sticker-content")
    .children(".sticker-title"))
}

function serverChangeTextStickers(stickerId, text) {
  $(`div#${stickerId}.sticker`)
    .children(".sticker-content")
    .children(".sticker-text")
    .val(text);
}

function serverChatMessage(message) {
  let content = $("<div>", {
    class: "message",
  });

  if (message.user.username === user.username) {
    message.user.username = "You";
  }

  content.append(
    $(`<div class = "message-username">${message.user.username}</div>`),
    $(`<div class = "message-text">${message.message}</dib>`),
  );
  $(".messages").append(content);
}

function serverLogStickerChange(stickerId, username) {
  let content = $("<div>", {
    class: "user-username",
    css: {
      background: "#d897f9",
      color: "#e5c710",
      position: "absolute",
      bottom: "200px",
    },
  });
  content.html(username, stickerId);

  $(".right-menu").append(content);
}

function serverUsersUpdate(users) {
  $(".chat-menu").children(".users-in-room").empty();
  users.forEach((elem) => {
    let content = $("<div>", {
      class: "user-username",
      id: elem.userId,
    });
    content.html(elem.username);

    $(".chat-menu").children(".users-in-room").append(content);
  });
}

function moveStickers(sticker, posX, posY) {
  if ($("#editMode").is(":checked") && connectionStatus) {
    sticker.children(".sticker-pin").addClass("unpinned");
    $(".workspace").on("mousemove", function (e) {
      posY = e.clientY - pageYOffset - 15;
      posX = e.clientX - pageXOffset - 145;
      sticker.offset({ top: posY, left: posX });
      sticker.css("z-index", 2);
      sendStickerPositionData(sticker.attr("id"), posX, posY, user.username);
    });
    sticker.on("click.second", function (e) {
      $(".workspace").off("mousemove");
      sticker.children(".sticker-pin").removeClass("unpinned");
      sticker.off("click.second");
      sticker.css("z-index", "");
      $.changeStickerPos(roomId, sticker.attr("id"), posX, posY);
    });
  }
}

function renderStickers(stickers) {
  stickers.forEach((elem) => {
    let sticker = $("<div>", {
      class: "sticker",
      id: elem.id,
      css: {
        position: "absolute",
        left: `${elem.posX}px`,
        top: `${elem.posY}px`,
      },
    })
      .append(
        $("<div>", {
          class: "sticker-pin pinned",
        }).append(
          $(`<svg viewBox="0 0 24 24" fill="none">
        <path opacity="0.15" d="M17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8Z" fill="#000000"/>
        <path d="M12 13V21M12 13C14.7614 13 17 10.7614 17 8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8C7 10.7614 9.23858 13 12 13Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`),
        ),
        $("<div>", {
          class: "sticker-content",
        }).append(
          $(`<input value = "${elem.title}" class = "sticker-title">`),
          $(
            `<textarea class = "sticker-text" rows="5" cols="80">${elem.text}</textarea>`,
          ),
        ),
      )
      .append(
        $("<div>", {
          class: "sticker-footer",
        }).append(
          $(
            `<button class = "sticker-save"><i class="fa-solid fa-check"></i></button>`,
          ),
          `<button class = "sticker-delete"><i class="fa-solid fa-trash"></i></button>`,
        ),
      );

    sticker.appendTo(".workspace");
  });
}

$(document).ready(function () {
  $(".room-name").text(roomOwner.username + "`s room");

  $(".sticker").on("click", function (e) {
    moveStickers($(this));
  });

  $(document).keydown(function (event) {
    var keyChar = String.fromCharCode(event.keyCode).toLowerCase();
    if (keyChar == "x" && event.ctrlKey && connectionStatus) {
      if ($("#editMode").prop("checked") === false) {
        $("#editMode").trigger("click");
      }
    } else if (keyChar == "q" && event.ctrlKey && connectionStatus) {
      if ($("#writeMode").prop("checked") === false) {
        $("#writeMode").trigger("click");
      }
    }
  });

  $("#editMode").on("click", function () {
    $("#writeMode").prop("checked", false);
  });

  $("#writeMode").on("click", function () {
    $("#editMode").prop("checked", false);
  });

  $(".sticker-pin").on("click", function () {
    $("#editMode").prop("checked", true);
    $("#writeMode").prop("checked", false);
  });

  $(".create-sticker").on("click", function (e) {
    let sticker = $.createSticker(roomId, 30, 80);
    if (sticker && connectionStatus) {
      socket.emit("newSticker");
      window.location.reload();
    }

  });

  $(".sticker-title").on("click", function (e) {
    $("#editMode").prop("checked", false);
    $("#writeMode").prop("checked", true);
  });
  $(".sticker-text").on("click", function (e) {
    $("#editMode").prop("checked", false);
    $("#writeMode").prop("checked", true);
  });

  $(".sticker-title").on("input", function (e) {
    let parent = $(e.target).closest(".sticker").attr("id");
    let input = e.target.value;
    if (connectionStatus) {
      socket.emit("titleSticker", {
        id: parent,
        text: input,
        username: user.username,
      });
    }
  });

  $(".sticker-text").on("input", function (e) {
    let parent = $(e.target).closest(".sticker").attr("id");
    if (connectionStatus) {
      let input = e.target.value;
      if (connectionStatus) {
        socket.emit("textSticker", {
          id: parent,
          text: input,
          username: user.username,
        });
      }
    }
  });

  $(".sticker-footer").on("click", function (e) {
    $("#editMode").prop("checked", false);
    $("#writeMode").prop("checked", true);
  });
  $(".sticker-save").on("click", function (e) {
    let parent = $(e.target).closest(".sticker");
    let fieldTitle = parent
      .children(".sticker-content")
      .children(".sticker-title")
      .val();
    let fieldText = parent
      .children(".sticker-content")
      .children(".sticker-text")
      .val();
    let parentId = parent.attr("id");
    if (connectionStatus) {

        try {

      let a = $.changeStickerTitle(roomId, parentId, fieldTitle);
      let b = $.changeStickerText(roomId, parentId, fieldText);
      if (a.message == true && b.message == true) {
        parent
          .children(".sticker-content")
          .children(".sticker-text")
          .css("background-color", "rgba(54, 189, 54, 0.329)");

        parent
          .children(".sticker-content")
          .children(".sticker-title")
          .css("background-color", "rgba(54, 189, 54, 0.329)");

        let a = setTimeout(() => {
          parent
            .children(".sticker-content")
            .children(".sticker-text")
            .css("background-color", "transparent");
          parent
            .children(".sticker-content")
            .children(".sticker-title",".sticker-text")
            .css("background-color", "transparent");
        }, 400);
        
        return function () {
          clearTimeout(a);
        };
      }

    } catch (error) {

        window.location.assign("./error.html")

    }
    }
  });

  $(".sticker-delete").on("click", function (e) {
    let parent = $(e.target).closest(".sticker").attr("id");
    let sure = confirm("Are you sure");
    if (connectionStatus && sure) {
      let a = $.deleteSticker(roomId, parent);
      if (a) {
        if (connectionStatus) {
          socket.emit("deleteSticker");
        }
        window.location.reload();
      }
    }
  });

  $(".chat-message").on("keydown", function (e) {
    if (e.keyCode == 13 && !e.shiftKey) {
      e.preventDefault();
      let message = $(".chat-message").html();
      if (connectionStatus && message.length != 0) {
        socket.emit("chatMessage", { message: message, user: user });
        $(".chat-message").html("");
      }
    }
  });

  $(".user-button").on("click", function () {
    $(".user-section").toggleClass("hide");
  });
  $(".right-menu").on("click", function (e) {
    $(this).children(".right-menu-arrow").toggleClass("rotate");
  });

  $(".right-menu").on("click", function () {
    $(this).toggleClass("open");
  });

  $(".chat-menu-arrow").on("click", function (e) {
    $(".chat-menu").toggleClass("open");
  });

  $("#change-room-password").on("click", function (e) {
    let roomPass = prompt("Select a new password");
    if (roomOwner.username === user.username) {
      let result = $.changeRoomPassword(roomPass);
      if (result) {
        alert(`New password is ${result.password}`);
      } else {
        alert(`Error`);
      }
    }
  });

  $(".nav-grip").on("mousedown", function (e) {
    $(document).on("mousemove", function (e) {
      posY = e.clientY - pageYOffset - 35;
      posX = e.clientX - pageXOffset - 245;
      $("nav").offset({ top: posY, left: posX });
    });
  });
  $(".nav-grip").on("mouseup", function (e) {
    $(document).off("mousemove");
  });

  window.addEventListener("pageshow", function (event) {
    var historyTraversal =
      event.persisted ||
      (typeof window.performance != "undefined" &&
        window.performance.navigation.type === 2);
    if (historyTraversal) {
      window.location.reload();
    }
  });
});
