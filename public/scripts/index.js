var barOpen = false;

function sidebar_open() {
    document.querySelector('[side-bar]').style.display = 'block';
    barOpen = true;
}

function sidebar_close() {
    document.querySelector('[side-bar]').style.display = 'none';
    barOpen = false;
}
