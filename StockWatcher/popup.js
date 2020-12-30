let changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('color', function(data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
});

changeColor.onclick = function(element) {
  let color = element.target.value;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(tabs.id,{
        // code: 'document.body.style.backgroundColor = "' + color + '";'
        file: 'action.js'
        //If you had something somewhat more complex you can use an IIFE:
        //code: '(function (){return document.body.innerText;})();'
        //If your code was complex, you should store it in a
        // separate .js file, which you inject with the file: property.
    });
  });
};
