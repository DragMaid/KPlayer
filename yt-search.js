const yts = require('yt-search');

async function find_video(keyword, range) {
    var data = await yts(keyword);
    return data.videos.slice(0, range);
}

module.exports = {
    find_video: find_video,
}
