const { writeFile } = require('fs');
const pageURL = String("http://localhost:3000/");
const mainURL = pageURL.substring(0, nthIndex(pageURL, '/', 3));
const quequeJSON = mainURL + '/storage' + '/queque.json';
const playlistJSON = mainURL + '/storage' + '/playlist.json';

const playlistPath = './public/storage/playlist.json';
const quequePath = './public/storage/queque.json';

function nthIndex(str, pat, n) {
    var L = str.length,
        i = -1;
    while (n-- && i++ < L) {
        i = str.indexOf(pat, i);
        if (i < 0) break;
    }
    return i;
}

function add_json_item(data, type) {
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
                writeFile(playlistPath, newJSON, (error) => {
                    if (error) { 
                        console.log("Failed to add item: ", error);
                        return;
                    } else {
                        console.log("Added new item to playlist!");
                    }
                });
            } else { console.log('item already existed!');  }
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
                if (dict.url == url) { callback(index); return true; }
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
            catch(err) { console.log(err); }
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
}
