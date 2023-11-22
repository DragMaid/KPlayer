const { exec } = require('node:child_process');
const ipc_path = "/tmp/mpvsocket";

function debug(error, stdout, stderr) {
    if (error) {
        console.log('%s', error);
        return;
    }
    console.log('stdout: %s', stdout);
    console.log('stderr: %s', stderr);
}

function open(link, callback) {
    const reset = "pkill mpv";
    const command = "mpv --no-video --ytdl-format=140 --input-ipc-server=" + ipc_path + " " + link;
    exec(reset, (error, stdout, stderr) => {
        exec(command, (error, stdout, stderr) => {
            debug(error, stdout, stderr);
            callback(stdout);
        })
    })
}

function play_queque(start) {
}

var queque_index = 0;
function open_queque(link, index) {
}

function get_time_pos() {
    command = "echo '{ \"command\": [\"get_property\", \"time-pos\"] }' | socat - " + ipc_path;
    exec(command, (error, stdout, stderr) => {
        debug(error, stdout, stderr);
    })
}

function get_duration() {
    command = "echo '{ \"command\": [\"get_property\", \"duration\"] }' | socat - " + ipc_path;
    exec(command, (error, stdout, stderr) => {
        debug(error, stdout, stderr);
    })
}

function play() {
    command = "echo '{ \"command\": [\"set_property\", \"pause\", false] }' | socat - " + ipc_path;
    exec(command, (error, stdout, stderr) => {
        debug(error, stdout, stderr);
    })
}

function pause() {
    command = "echo '{ \"command\": [\"set_property\", \"pause\", true] }' | socat - " + ipc_path;
    exec(command, (error, stdout, stderr) => {
        debug(error, stdout, stderr);
    })
}

module.exports = {
    open: open,
    play: play,
    pause: pause,
    get_duration: get_duration,
    get_time_pos: get_time_pos,
}
