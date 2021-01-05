document.addEventListener('DOMContentLoaded', function() {
  var checkPageButton = document.getElementById('checkPage');
  checkPageButton.addEventListener('click', function() {

    chrome.tabs.getSelected(null, function(tab) {
      d = document;

      // var f = d.createElement('form');
      // f.action = 'http://gtmetrix.com/analyze.html?bm';
      // f.method = 'post';
      // var i = d.createElement('input');
      // i.type = 'hidden';
      // i.name = 'url';
      // i.value = tab.url;
      // f.appendChild(i);
      // d.body.appendChild(f);
      // f.submit();

      var newURL = "http://stackoverflow.com/";
      chrome.tabs.create({ url: newURL });

    });
  }, false);
}, false);


 // chrome.tabs.create({
 // active: false,
 // url: 'http://stackoveflow.com/robots.txt'
 // }, function(tab) {
 //     chrome.tabs.executeScript(tab.id, {
 //         code: 'localStorage.setItem("key", "value");'
 //     }, function() {
 //         chrome.tabs.remove(tab.id);
 //     });
 // });

// chrome.runtime.sendMessage('', {
//     type: 'notification',
//     options: {
//       title: 'Just wanted to notify you',
//       message: 'How great it is!',
//       iconUrl: 'icon.png',
//       type: 'basic'
//     }
// });

// fetch(newURL, {
//     mode:'no-cors'
// }).then(request => request.text())
// .then(function(text){
//     webText = text.matchAll('/<a href="https:\/\/sfbay\.craigslist\.org\/sby\/zip\/d\/.*\.html" data-id="\d+" class="result-title hdrlnk" id="postid_\d+">.*<\/a>/');
//     console.log(webText);
//     // console.log(text);
// })
// .catch((error) => {
//     console.warn(error);
// });
