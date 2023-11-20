const yts = require('yt-search')
async function findVideo(keyword, range) {
    var data = await yts(keyword);
    data.then(function(result) {
        return result.videos.slice(0, range);
    })
}
module.exports = findVideo;
