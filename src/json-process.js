const { writeFile } = require('fs');
const pageURL = String("http://localhost:3000/");
const mainURL = pageURL.substring(0, nthIndex(pageURL, '/', 3));
const playlistJSON = mainURL + '/storage';
const playlistPATH = './storage/playerlist.json';
const jlog = require('./server-logger.js');

function nthIndex(str, pat, n) {
    var L = str.length,
        i = -1;
    while (n-- && i++ < L) {
        i = str.indexOf(pat, i);
        if (i < 0) break;
    }
    return i;
}

function add_json_item(data, type, callback) {
    fetch(playlistJSON) 
    .then( (response) => { 
        var res = response; 
        var json = res.json(); 
        json.then( (res) => {
            var obj = res;
            var exist = false;
            obj[type].forEach( (dict, index) => { 
                if (dict.url == data[3]) { exist = true; }
            });
            if (exist == false) {
                obj[type].push({
                    "thumbnail": data[0],
                    "title": data[1],
                    "creator": data[2],
                    "url": data[3]
                });
                var newJSON = JSON.stringify(obj);
                writeFile(playlistPATH, newJSON, (error) => {
                    if (error) { 
                        jlog.log("ERROR", "Failed to add item: " + error);
                        return;
                    } else {
                        jlog.log("INFO", "Added new item to queque " + obj);
                    }
                });
            } else { jlog.log("INFO", "Item already existed " + obj);  }
            callback();
        })
    })
}

function add_dict_json_item(playlist, data, callback) {
    fetch(playlistJSON) 
    .then( (response) => { 
        var res = response; 
        var json = res.json(); 
        json.then( (res) => {
            var obj = res;
            var exist = false;
            if (playlist in obj['playlist']) {
                obj['playlist'][playlist].forEach( (dict, index) => { 
                    if (dict.url == data[3]) { exist = true; }
                });
            } else {
                obj['playlist'][playlist] = [];
            }
            if (exist == false) {
                obj['playlist'][playlist].push({
                    "thumbnail": data[0],
                    "title": data[1],
                    "creator": data[2],
                    "url": data[3]
                });
                var newJSON = JSON.stringify(obj);
                writeFile(playlistPATH, newJSON, (error) => {
                    if (error) { 
                        jlog.log("ERROR", "Failed to add item: " + error);
                        return;
                    } else {
                        jlog.log("INFO", "Added new item to playlist " + obj);
                    }
                });
            } else { jlog.log("INFO", "Item already existed " + obj);  }
            callback();
        })
    })
}

function delete_playlist_video(playlist, url) {
    fetch(playlistJSON) 
    .then( (response) => { 
        var res = response; 
        var json = res.json(); 
        json.then( (res) => {
            var obj = res;
            obj['playlist'][playlist].forEach( (dict, index) => { 
                if (dict.url == url) {
                    obj['playlist'][playlist].splice(index, 1);
                    var newJSON = JSON.stringify(obj);
                    writeFile(playlistPATH, newJSON, (error) => {
                        if (error) { 
                            jlog.log("ERROR", "Failed to add item: " + error);
                            return;
                        } else {
                            jlog.log("INFO", "Removed 1 video form playlist" + obj);
                        }
                    })
                }
            }) 
        })
    })
}

function delete_playlist(playlist) {
    fetch(playlistJSON) 
    .then( (response) => { 
        var res = response; 
        var json = res.json(); 
        json.then( (res) => {
            var obj = res;
            if (playlist in obj['playlist']) {
                delete obj['playlist'][playlist];
                var newJSON = JSON.stringify(obj);
                writeFile(playlistPATH, newJSON, (error) => {
                    if (error) { 
                        jlog.log("ERROR", "Failed to remove playlist: " + error);
                        return;
                    } else {
                        jlog.log("INFO", "Removed 1 playlist" + playlist);
                    }
                })
            } else { jlog.log("INFO", "No playlist found"); }
        })
    })
}

function delete_queque_video(url) {
    fetch(playlistJSON) 
    .then( (response) => { 
        var res = response; 
        var json = res.json(); 
        json.then( (res) => {
            var obj = res;
            obj['queque'].forEach( (dict, index) => { 
                if (dict.url == url) {
                    obj['queque'].splice(index, 1);
                    var newJSON = JSON.stringify(obj);
                    writeFile(playlistPATH, newJSON, (error) => {
                        if (error) { 
                            jlog.log("ERROR", "Failed to add item: " + error);
                            return;
                        } else {
                            jlog.log("INFO", "Removed 1 video from queque " + url);
                        }
                    })
                    return;
                }
            })
        })
    })
}

function find_item_index(type, url, callback) {
    fetch(playlistJSON) 
    .then( (response) => { 
        var res = response; 
        var json = res.json(); 
        json.then( (res) => {
            var obj = res;
            obj[type].forEach( (dict, index) => { 
                if (dict.url == url) {
                    callback(index); 
                    return true;
                }
            })
        })
    })
}

function get_item_url(type, index, callback) {
    fetch(playlistJSON) 
    .then( (response) => { 
        var res = response; 
        var json = res.json(); 
        json.then( (res) => {
            var obj = res;
            try { callback(obj[type][index].url); }
            catch(err) { jlog.log("ERROR", err); }
        })
    })
} 

function get_playlist_item_url(playlist, index, callback) {
    fetch(playlistJSON) 
    .then( (response) => { 
        var res = response; 
        var json = res.json(); 
        json.then( (res) => {
            var obj = res;
            try { callback(obj['playlist'][playlist][index].url); }
            catch(err) { jlog.log("ERROR", err); }
        })
    })
} 

function find_playlist_index(playlist, url, callback) {
    fetch(playlistJSON) 
    .then( (response) => { 
        var res = response; 
        var json = res.json(); 
        json.then( (res) => {
            var obj = res;
            obj['playlist'][playlist].forEach( (dict, index) => { 
                if (dict.url == url) {
                    callback(index); 
                    return ;
                }
            })
        })
    })
}

function get_playlist_item(playlist, callback) {
    fetch(playlistJSON) 
    .then( (response) => { 
        var res = response; 
        var json = res.json(); 
        json.then( (res) => {
            var obj = res;
            callback(obj['playlist'][playlist]);
        })
    })
}

function get_item(type, callback) {
    fetch(playlistJSON) 
    .then( (response) => { 
        var res = response; 
        var json = res.json(); 
        json.then( (res) => {
            var obj = res;
            callback(obj[type]);
        })
    })
}

module.exports = {
    add_json_item: add_json_item,
    get_item_url: get_item_url,
    get_item: get_item,
    find_item_index: find_item_index,
    get_playlist_item_url: get_playlist_item_url,
    get_playlist_item: get_playlist_item,
    find_playlist_index: find_playlist_index,
    add_dict_json_item: add_dict_json_item,
    delete_queque_video: delete_queque_video,
    delete_playlist: delete_playlist,
    delete_playlist_video: delete_playlist_video,
}
