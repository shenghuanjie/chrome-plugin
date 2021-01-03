let changeColor = document.getElementById('checkCraigslist');
chrome.storage.sync.get('color', function(data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
});

const keyValues = ['mileage', 'postcode', 'keywords'];
function getURL(searchData){
    var keywords = searchData['keywords'];
    keywords = keywords.replaceAll('|', '%7C').replaceAll(' ', '%20');
    var newURL = 'https://sfbay.craigslist.org/search/sby/zip?query='
     + keywords + '&sort=date&search_distance=' + searchData['mileage']
     + '&postal=' + searchData['postcode'];
    return newURL;
}

changeColor.addEventListener('click', function(element) {
    // var color = element.target.value;
    chrome.notifications.getAll((items) => {
        if ( items ) {
            for (let key in items) {
                chrome.notifications.clear(key);
            }
        }
    });

   chrome.storage.sync.get(keyValues, function(searchData) {
       var newURL = getURL(searchData);
        chrome.tabs.create({url: newURL});
    });

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

});
