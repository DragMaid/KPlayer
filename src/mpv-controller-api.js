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
var on_stop_callback = function(){};

async function player_handler(callback) {
    try { await callback() }
    catch (error) { console.log("WARNING: ", error); }
}

async function init() { 
    player_handler(() => { 
        mpv.start(); 
        console.log("INFO: Initilialized mpv player");
    });
}

async function open(url, callback) {
    try {
        console.log("INFO: Playing selected song");
        await mpv.load(url, mode="replace");
        await mpv.volume(70);
        on_stop_callback = callback;
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
    player_handler(() => { mpv.volume(volume); });
}

mpv.on('stopped', () => {
    try { on_stop_callback(); }
    catch(error) { console.log("WARNING: ", error); }
});

module.exports = {
    play: play,
    pause: pause,
    init: init,
    open: open,
    change_volume: change_volume,
}
