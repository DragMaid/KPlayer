const socket = new WebSocket("ws://localhost:8080");


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
    const processed_data = JSON.parse(event.data);
    const key_value = processed_data[0];
    switch (key_value) {
        case 'create':
            const info = processed_data[1];
            add_card(info[0], info[1], info[2], info[3]);
            break;
        case 'queque':
            change_preview_image(processed_data[1]);
            break;
        case 'playlist':
            change_preview_image(processed_data[1]);
            break;
        default:
            console.log("unrecognizable msg type: (%s) %s", key_value, processed_data[1]);
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
        sendMsg('search', [input]);
    }
}

var current_playlist = null;
function card_func(thumbnail, title, creator, url) {
    isPlaying = true;
    if (url != null) {
        switch (mode) {
            case 'search':
                change_preview_image(thumbnail);
                set_video(thumbnail, title, creator, url);
                sendMsg('open', [url]);
                break;
            case 'queque':
                change_preview_image(thumbnail);
                set_video(thumbnail, title, creator, url);
                sendMsg('queque', [url]);
                break;
            case 'playlist_select':
                current_playlist = title;
                load_playlist_videos();
                change_mode('playlist');
                sendMsg('playlist_select', [title]);
                break;
            case 'playlist':
                change_preview_image(thumbnail);
                set_video(thumbnail, title, creator, url);
                sendMsg('playlist', [url]);
                break;
            case 'playlist_add':
                add_to_playlist(title);
                break;
            case 'download':
                break;
            default:
                console.log("WARNING: mode not recognized");
        }
    }
}

function change_mode(value) { mode = value; }
function load_search() {
    clear_list();
    change_mode("search");
    open_side_bar();
}

function set_video(thumbnail, title, creator, url) {
    current_video = [thumbnail, title, creator, url];
}

function delete_queque_video() {
}

function delete_playlist() {
}

function remove_button_func(url, title, id) {
    if (url == '') {
        delete_playlist(title);
        sendMsg('delete_playlist', [title]);
    } else if (mode == 'playlist') {
        delete_queque_video(url);
        sendMsg('delete_playlist_video', [url]);
    } else {
        delete_queque_video(url);
        sendMsg('delete_queque_video', [url]);
    }
    remove_card(id);
}

function toggle_state() {
    play_button_toggle(isPlaying);
    if (current_video.length > 0) {
        if (isPlaying) { sendMsg('pause', [true]); }
        else { sendMsg('play', [true]); }
    }
    isPlaying = !(isPlaying);
}

function add_playlist() {
    close_bottom_panel();
    open_playlist_panel();
}

function add_existing_playlist() {
    load_playlist();
    change_mode('playlist_add');
    close_playlist_panel();
}

const name_input = document.querySelector("[text-field]");
function create_new_playlist() {
    if (current_video.length > 0) { add_to_playlist(name_input.value); }
    close_name_panel();
}

function add_to_playlist(playlist) {
    if (current_video.length > 0) { sendMsg('add_playlist', [playlist, current_video]); }
}

function add_queque() {
    if (current_video.length > 0) { sendMsg('add_queque', current_video); }
    close_bottom_panel();
}

function add_download() {
    if (current_video.length > 0) { sendMsg('add_download', current_video); }
    close_bottom_panel();
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
            if (json['queque'].length > 0) {
                json['queque'].forEach( (dict, index) => { add_card(dict.thumbnail, dict.title, dict.creator, dict.url); });
            }
        })
    })
    close_side_bar();
}

var playlist_thumbnail = "https://www.kindpng.com/picc/m/106-1068121_transparent-music-icon-png-icon-music-png-png.png";
function load_playlist() {
    clear_list();
    change_mode('playlist_select');
    fetch(playlistJSON) 
    .then( (res) => { 
        var raw = res; 
        var json = raw.json(); 
        json.then( (res) => {
            var json = res;
            for (const [key, value] of Object.entries(json['playlist'])) {
                add_card(playlist_thumbnail, key, value.length, '');
            }
        })
    })
    close_side_bar();
}

function load_playlist_videos() {
    clear_list();
    change_mode('playlist');
    fetch(playlistJSON) 
    .then( (res) => { 
        var raw = res; 
        var json = raw.json(); 
        json.then( (res) => {
            var json = res;
            json['playlist'][current_playlist].forEach( (dict, index) => { add_card(dict.thumbnail, dict.title, dict.creator, dict.url); });
        })
    })
}
