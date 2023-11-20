let socket = new WebSocket("ws://localhost:8080")

socket.onopen = function(e) {
  //console.log("[open] Connection established");
};

socket.onmessage = function(event) {
  //alert(`[message] Data received from server: ${event.data}`);
};

socket.onclose = function(event) {
  if (event.wasClean) {
    //alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    //alert('[close] Connection died');
  }
};

socket.onerror = function(error) {
  //alert(`[error]`);
};

function sendMsg(type, content) {
    socket.send(type + ":" + content);
}
