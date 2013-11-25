var showAlert = function() {
  setTimeout(eval("alert('アラート')"), 0);
};

var sampleObject = new Object()
var sampleArray = new Array();

var sampleFunction = function() {
  if(sampleObject != null) {
    console.log(argument.callee);
  }
};

$(function() {  
  $("#js-global-nav").on("touchstart", "a", function(e) {
    $(this).addClass("active");
  }).on("touchend", "a", function(e) {
    $(this).removeClass("active");
  });
});