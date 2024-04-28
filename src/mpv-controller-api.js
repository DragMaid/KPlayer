const mpvAPI = require('node-mpv');
const mpv = new mpvAPI(
    {
        "audio_only": true,
        "binary": null,
        "debug": true,
        "verbose": false,
    },
    [
        "--ytdl-format=140",
        //"--log-file=./mpv.log",
        "--ytdl-raw-options=force-ipv4=",
    ]
);
var p_volume = 70;
var on_stop_callback = function(){};
var on_stop_extend = function(){};
var on_start_callback = function(){};
var on_pause_callback = function(){};
var is_playing = false;

async function player_handler(callback) {
    try { await callback() }
    catch (error) { console.log("WARNING: ", error); }
}

async function init(on_start, on_pause, on_stop) { 
    on_start_callback = on_start;
    on_pause_callback = on_pause;
    on_stop_callback = on_stop;

    player_handler(() => { 
        mpv.start(); 
        console.log("INFO: Initilialized mpv player");
    });
}

async function open(url, early_callback, late_callback) {
    try {
        console.log("INFO: Playing selected song");
        early_callback();
        await mpv.load(url, mode="replace");
        await mpv.volume(p_volume);
        on_stop_extend = late_callback;
    } catch(error) {
        console.log("WARNING: ", error);
    }
}

async function play() {
    player_handler(() => { mpv.play(); });
}

async function pause() {
    player_handler(() => { mpv.pause(); });
}

async function change_volume(volume) {
    player_handler(() => { mpv.volume(volume); p_volume = volume});
}

function get_status() {
    return is_playing;
}

mpv.on('started', () => {
    is_playing = true;
    on_start_callback();
});

mpv.on('stopped', () => {
    is_playing = false;
    on_stop_callback();
    try { on_stop_extend(); }
    catch(error) { console.log("WARNING: ", error); }
});

//mpv.on('paused', () => {
    //is_playing = false;
    //on_pause_callback();
//});

//mpv.on('resumed', () => {
    //is_playing = true;
    //on_stop_callback();
//});

module.exports = {
    play: play,
    pause: pause,
    init: init,
    open: open,
    change_volume: change_volume,
    get_status: get_status,
}
