const { writeFile } = require('fs');
const pageURL = String("http://localhost:3000/");
const mainURL = pageURL.substring(0, nthIndex(pageURL, '/', 3));
const quequeJSON = mainURL + '/storage' + '/queque.json';
const playlistJSON = mainURL + '/storage' + '/playlist.json';
console.log(playlistJSON);

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

async function add_playlist_item(data) {
    await fetch(playlistJSON) 
    .then( (response) => { console.log(response.text()); })
    .then( (json) => { return JSON.parse(json); })
    .then( (obj) => { 
        var new_json = JSON.stringify(obj.push({
            "thumbnail": data[0],
            "title": data[1],
            "creator": data[2],
            "url": data[3]
        }));
        writeFile(playlistPath, new_json, (error) => {
            if (error) { 
                console.log("Failed to add item: ", error);
                return;
            } else {
                console.log("Added new item to playlist!");
            }
        });
    })
}

module.exports = {
    add_playlist_item: add_playlist_item,
}
