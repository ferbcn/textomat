// Connect to websocket
if (socket)
  socket.socket.connect(location.protocol + '//' + document.domain + ':' + location.port);
else
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
//console.log(socket);

// When connected, configure buttons
socket.on('connect', () => {
  //console.log("websocket conneted...", socket);
});

// supress backspace navigation in browser functionality and remove last character in textarea
$(function disableBS(){
  /*
   * this swallows backspace keys on any non-input element.
   * stops backspace -> back
   */
  var rx = /INPUT|SELECT|TEXTAREA/i;

  $(document).bind("keydown keypress", function(e){
      if( e.which == 8 ){ // 8 == backspace
          if(!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly ){
              e.preventDefault();
              let text = document.getElementsByClassName('Typewriter__wrapper')[0].innerHTML;
              newtext = text.substring(0, text.length - 1);
              document.getElementsByClassName('Typewriter__wrapper')[0].innerHTML = newtext;
          }
      }
  });
});


var typewriter = null;

document.addEventListener('DOMContentLoaded', () => {
    typewriter = new Typewriter('#textoutput', {
      loop: false,
      delay: 20
    });
    typewriter.typeString('Hello World!').start().deleteAll();
});


document.onkeypress = function(evt) {
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    //console.log(charCode);
    // detect new line character (ENTER)
    if (charCode == 13){
      loadtext();
      document.getElementsByClassName('Typewriter__wrapper')[0].innerHTML += "<br>";
    }
    var charStr = String.fromCharCode(charCode);
    typewriter.typeString(charStr).start();
};

// send new data request (load new data from server)
// TO-DO: run automatically when enough words have been written and there is a certain pause
function loadtext() {
    let data = document.getElementsByClassName('Typewriter__wrapper')[0].innerHTML;
    let res = data.split("<br>");
    let last = res.slice(-1)[0]; // get last element in array
    // console.log(last)
    socket.emit('textinput', last);
};

// message received from server
socket.on('newdata', newdata => {
  // Create new post.
  console.log("Message received:", newdata);
  //cleartext();
  newdata += "<br>"
  typewriter.typeString(newdata).start();

});


function cleartext(){
    document.getElementsByClassName('Typewriter__wrapper')[0].innerHTML = "";
}
