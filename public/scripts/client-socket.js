let socket = new WebSocket("ws://localhost:8080")

socket.onopen = function(e) {
    //console.log("[open] Connection established");
};

socket.onmessage = function(event) {
    console.log(event.data);
    const processed_data = JSON.parse(event.data);
    const key_value = processed_data[0];
    switch (key_value) {
        case 'create':
            const info = processed_data[1];
            addCard(info[0], info[1], info[2], info[3]);
            break;
        default:
            console.log("unrecognizable msg type: %s", key_value[0]);
            break;
    }
};

socket.onclose = function(event) {
    if (event.wasClean) {
        alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
        alert('[close] Connection died');
    }
};

socket.onerror = function(error) {
    //alert(`[error]`);
};

function sendMsg(type, content) {
    socket.send(JSON.stringify([type, content]));
}

function search() {
    var input = document.querySelector('[bar-field]').value;
    if (input.length > 0) {
        sendMsg('search', [input]);
    }
}

var current_video = [];
function card_func(thumbnail, title, creator, url) {
    const image_preview = document.querySelector('[img]');
    console.log(image_preview);
    image_preview.src = thumbnail;
    document.getElementById('myicon').className = "fa fa-pause"; 
    current_video = [thumbnail, title, creator, url];
    if (url != null) {
        sendMsg('open', [url]);
    }
}

function toggle_state() {
    const toggle_button = document.getElementById('myicon');
    if (toggle_button.className == "fa fa-play") { 
        toggle_button.className = "fa fa-pause";
        sendMsg('pause', [true]);
    } else {
        toggle_button.className = "fa fa-play";
        sendMsg('play', [true]);
    }
}

function add_playlist() {
    console.log("hello");
    if (current_video.length > 0) {
        sendMsg('add_playlist', current_video);
    }
}

const videoCardTemplate = document.querySelector('[video-card-template]');
console.log(videoCardTemplate);
const videosList = document.querySelector('[videos-list]');

function addCard(link, title, creator, url) {
    const card = videoCardTemplate.content.cloneNode(true).children[0];
    const thumbnail = card.querySelector('[thumbnail]');
    const videoTitle = card.querySelector('[video-title]');
    const videoCreator = card.querySelector('[video-creator]');

    thumbnail.src = link;
    videoTitle.textContent = title;
    videoCreator.textContent = creator;

    videosList.append(card);
    card.addEventListener("click", function(){card_func(link, title, creator, url);});
}
