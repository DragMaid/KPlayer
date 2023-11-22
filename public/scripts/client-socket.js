let socket = new WebSocket("ws://localhost:8080")

var isPlaying = false;

socket.onopen = function(e) {
    console.log("[open] Connection established");
};

var mode = 'search';

socket.onmessage = function(event) {
    console.log(event.data);
    const processed_data = JSON.parse(event.data);
    const key_value = processed_data[0];
    switch (key_value) {
        case 'create':
            const info = processed_data[1];
            addCard(info[0], info[1], info[2], info[3]);
            break;
        case 'queque':
            const image_preview = document.querySelector('[img]');
            image_preview.src = processed_data[1];
            
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
    alert(`[error]`);
};

function sendMsg(type, content) {
    socket.send(JSON.stringify([type, content]));
}

function search() {
    var input = document.querySelector('[bar-field]').value;
    if (input.length > 0) {
        clear_list(); 
        mode = 'search';
        sendMsg('search', [input]);
    }
}

var current_video = [];
function card_func(thumbnail, title, creator, url) {
    const image_preview = document.querySelector('[img]');
    image_preview.src = thumbnail;
    document.getElementById('myicon').className = "fa fa-pause"; 
    isPlaying = true;
    current_video = [thumbnail, title, creator, url];
    if (url != null) {
        switch (mode) {
            case 'search':
                sendMsg('open', [url]);
                break;
            case 'queque':
                sendMsg('queque', [url]);
                break;
            case 'download':
                break;
        }
    }
}

function toggle_state() {
    const toggle_button = document.getElementById('myicon');
    if (isPlaying == true) { 
        isPlaying = false;
        toggle_button.className = "fa fa-play";
        sendMsg('pause', [true]);
    } else {
        isPlaying = true;
        toggle_button.className = "fa fa-pause";
        sendMsg('play', [true]);
    }
}

function add_playlist() {
    if (current_video.length > 0) {
        sendMsg('add_playlist', current_video);
    }
}

function clear_list() {
    //while (videosList.firstChild) { videosList.remove(videosList.firstChild); }
    videosList.innerHTML = '';
}


function nthIndex(str, pat, n) {
    var L = str.length,
        i = -1;
    while (n-- && i++ < L) {
        i = str.indexOf(pat, i);
        if (i < 0) break;
    }
    return i;
}
const pageURL = String(document.URL);
const mainURL = pageURL.substring(0, nthIndex(pageURL, '/', 3));
const quequeJSON = mainURL + '/storage' + '/queque.json';
const playlistJSON = mainURL + '/storage' + '/playlist.json';

function load_queque() {
    clear_list();
    mode = 'queque'; 
    fetch(playlistJSON) 
    .then( (response) => { 
        var res = response; 
        var json = res.json(); 
        json.then( (res) => {
            var obj = res;
            obj['playlist'].forEach( (dict, index) => {
                addCard(dict.thumbnail, dict.title, dict.creator, dict.url);
            });
        })
    })
    sidebar_close();
}

const videoCardTemplate = document.querySelector('[video-card-template]');
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
