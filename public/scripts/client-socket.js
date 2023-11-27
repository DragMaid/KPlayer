var socket = new WebSocket("ws://localhost:8080")

var isPlaying = false;
var mode = 'search';
var current_video = [];

const pageURL = String(document.URL);
const mainURL = pageURL.substring(0, nthIndex(pageURL, '/', 3));
const playlistJSON = mainURL + '/storage';

socket.onopen = function(e) {
    console.log("[open] Connection established");
    close_loading_screen();
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
    open_loading_screen();
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
        change_mode('queque');
        sendMsg('search', [input]);
    }
}

function card_func(thumbnail, title, creator, url) {
    isPlaying = true;
    change_preview_image(thumbnail);
    set_video(thumbnail, title, creator, url);
    if (url != null) {
        switch (mode) {
            case 'search':
                sendMsg('open', [url]);
                break;
            case 'queque':
                sendMsg('queque', [url]);
                break;
            case 'playlist':
                sendMSg('playlist', [url]);
                break;
            case 'download':
                break;
        }
    }
}

function change_mode(mode) { mode = mode; }

function set_video(thumbnail, title, creator, url) {
    current_video = [thumbnail, title, creator, url];
}

function toggle_state() {
    play_button_toggle(isPlaying);
    if (isPlaying) { sendMsg('pause', [true]); }
    else { sendMsg('play', [true]); }
    isPlaying = !(isPlaying);
}

function add_playlist() {
    if (current_video.length > 0) { sendMsg('add_playlist', current_video); }
}

function add_queque() {
    if (current_video.length > 0) { sendMsg('add_queque', current_video); }

}

function add_download() {
    if (current_video.length > 0) { sendMsg('add_download', current_video); }
}

function clear_list() { videosList.innerHTML = ''; }

function nthIndex(str, pat, n) {
    var L = str.length, i = -1;
    while (n-- && i++ < L) { i = str.indexOf(pat, i); if (i < 0) break; }
    return i;
}

function load_queque() {
    clear_list();
    change_mode('queque');
    fetch(playlistJSON) 
    .then( (res) => { 
        var raw = res; 
        var json = raw.json(); 
        json.then( (res) => {
            var json = res;
            json['playlist'].forEach( (dict, index) => { add_card(dict.thumbnail, dict.title, dict.creator, dict.url); });
        })
    })
    open_side_bar();
}
