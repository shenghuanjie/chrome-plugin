console.log("test script");
var newURL = "http://stackoverflow.com/";
chrome.tabs.create({ url: newURL });
// debugger

function setTheColor() {
  document.body.style.backgroundColor = "' + color + '";
  console.log("test me");
}
