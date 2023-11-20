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
            addCard(info[0], info[1], info[2]);
            break;
        default:
            console.log("unrecognizable msg type: %s", key_value[0]);
            break;
    }
};

socket.onclose = function(event) {
    if (event.wasClean) {
        //alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
        //alert('[close] Connection died');
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

const videoCardTemplate = document.querySelector('[video-card-template]');
console.log(videoCardTemplate);
const videosList = document.querySelector('[videos-list]');

function addCard(link, title, creator) {
    const card = videoCardTemplate.content.cloneNode(true).children[0];
    const thumbnail = card.querySelector('[thumbnail]');
    const videoTitle = card.querySelector('[video-title]');
    const videoCreator = card.querySelector('[video-creator]');

    thumbnail.src = link;
    videoTitle.textContent = title;
    videoCreator.textContent = creator;

    videosList.append(card);
}
