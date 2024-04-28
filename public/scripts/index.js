const sidebar = document.querySelector("[side-bar]");
const sidebar_overlay = document.querySelector("[side-bar-overlay]");
const panel = document.querySelector("[bottom-panel]");
const videoCardTemplate = document.querySelector("[video-card-template]");
const videosList = document.querySelector('[videos-list]');
const panel_overlay = document.querySelector("[bottom-panel-overlay]");
const playlist_select_panel = document.querySelector("[playlist-select-panel]");
const playlist_select_overlay = document.querySelector("[playlist-select-overlay]");
const name_input_panel = document.querySelector("[name-input-panel]");
const name_input_overlay = document.querySelector("[name-input-overlay]");
const loading_screen_overlay = document.querySelector("[loading-screen-overlay]");

function open_side_bar() {
    sidebar.classList.toggle("active");
    sidebar_overlay.classList.toggle("active");
}

function close_side_bar() {
    sidebar.classList.remove("active");
    sidebar_overlay.classList.remove("active");
}

function open_bottom_panel() {
    panel.classList.toggle("active");
    panel_overlay.classList.toggle("active");
}

function close_bottom_panel() {
    panel.classList.remove("active");
    panel_overlay.classList.remove("active");
}

function open_playlist_panel() {
    playlist_select_panel.classList.toggle("active");
    playlist_select_overlay.classList.toggle("active");
}

function change_volume_value(value) {
    var slider = document.querySelector('[volume_slider]');
    slider.value = value;
}

function close_playlist_panel() {
    playlist_select_panel.classList.remove("active");
    playlist_select_overlay.classList.remove("active");
}

function open_name_panel() {
    close_playlist_panel();
    name_input_panel.classList.toggle("active");
    name_input_overlay.classList.toggle("active");
}

function close_name_panel() {
    name_input_panel.classList.remove("active");
    name_input_overlay.classList.remove("active");
}

function open_loading_screen() {
    loading_screen_overlay.classList.toggle("active");
}

function close_loading_screen() {
    loading_screen_overlay.classList.remove("active");
}

document.onclick = function(e) {
    if(e.target.id === "bottom-overlay") { close_bottom_panel() }
    if(e.target.id === "side-bar-overlay") { close_side_bar() }
    if(e.target.id === "playlist-select-overlay") { close_playlist_panel() }
    if(e.target.id === "name-input-overlay") { close_name_panel() }
}

function play_button_toggle(isPlaying) {
    const toggle_button = document.getElementById('myicon');
    if (isPlaying) { toggle_button.className = "fa fa-play"; }
    else { toggle_button.className = "fa fa-pause"; }
}

function change_preview_image(thumbnail) {
    const image_preview = document.querySelector('[img]');
    image_preview.src = thumbnail;
    document.getElementById('myicon').className = "fa fa-pause"; 
}

function remove_card(id) {
    var elem = document.getElementById(id);
    return elem.parentNode.removeChild(elem);
}

function add_card(link, title, creator, url) {
    const card = videoCardTemplate.content.cloneNode(true).children[0];
    const thumbnail = card.querySelector('[thumbnail]');
    const infoHolder = card.querySelector('[info-holder]');
    const videoTitle = card.querySelector('[video-title]');
    const videoCreator = card.querySelector('[video-creator]');
    const removeButton = card.querySelector('[remove-button]');
    const id = title;

    thumbnail.src = link;
    videoTitle.textContent = title;
    videoCreator.textContent = creator;
    card.id = id;

    videosList.append(card);
    thumbnail.addEventListener("click", function(){card_func(link, title, creator, url);});
    infoHolder.addEventListener("click", function(){card_func(link, title, creator, url);});
    removeButton.addEventListener("click", function(){remove_button_func(url, title, id);});
}
