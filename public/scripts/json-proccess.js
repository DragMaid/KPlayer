const pageURL = String(document.URL);
const mainURL = pageURL.substring(0, nthIndex(pageURL, '/', 3));
const quequeJSON = mainURL + '/storage' + '/queque.json';
const playlistJSON = mainURL + '/storage' + '/playlist.json';

function fetch_data(link) {
    fetch(link) {


}

