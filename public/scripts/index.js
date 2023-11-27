const sidebar = document.querySelector("[side-bar]");
const sidebar_overlay = document.querySelector("[side-bar-overlay]");
const panel = document.querySelector("[bottom-panel]");
const videoCardTemplate = document.querySelector('[video-card-template]');
const videosList = document.querySelector('[videos-list]');
const panel_overlay = document.querySelector("[bottom-panel-overlay]");

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

function open_loading_screen() {
}

function close_loading_screen() {
}

document.onclick = function(e) {
    if(e.target.id === "bottom-overlay") { close_bottom_panel() }
    if(e.target.id === "side-bar-overlay") { close_side_bar() }
}

function  play_button_toggle(isPlaying) {
    const toggle_button = document.getElementById('myicon');
    if (isPlaying) { toggle_button.className = "fa fa-play"; }
    else { toggle_button.className = "fa fa-pause"; }
}

function change_preview_image(thumbnail) {
    const image_preview = document.querySelector('[img]');
    image_preview.src = thumbnail;
    document.getElementById('myicon').className = "fa fa-pause"; 
}

function add_card(link, title, creator, url) {
    const card = videoCardTemplate.content.cloneNode(true).children[0];
    const thumbnail = card.querySelector('[thumbnail]');
    const videoTitle = card.querySelector('[video-title]');
    const videoCreator = card.querySelector('[video-creator]');

    thumbnail.src = link;
    videoTitle.textContent = title;
    videoCreator.textContent = creator;

    videosList.append(card);
    card.addEventListener("click", function(){card_func(link, title, creator, url);});
}
