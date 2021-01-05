let openPage = document.getElementById('checkCraigslist');
chrome.storage.sync.get('color', function(data) {
  openPage.style.backgroundColor = data.color;
  openPage.setAttribute('value', data.color);
});

const keyValues = ['mileage', 'postcode', 'keywords'];
const statusText = {'Start': 'Monitoring...', 'Stop': 'Pause!'};
const buttonText = {'Start': 'Stop', 'Stop': 'Start'};
function getURL(searchData){
    var keywords = searchData['keywords'];
    keywords = keywords.replaceAll('|', '%7C').replaceAll(' ', '%20');
    var newURL = 'https://sfbay.craigslist.org/search/sby/zip?query='
     + keywords + '&sort=date&search_distance=' + searchData['mileage']
     + '&postal=' + searchData['postcode'];
    return newURL;
}

openPage.addEventListener('click', function(element) {
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

});

let status = document.getElementById('status');
let toggleSwitch = document.getElementById('monitorCraigslist');

chrome.storage.local.get('status', function(data) {
    toggleSwitch.innerHTML = buttonText[data.status];
    status.innerHTML = statusText[data.status];
});

toggleSwitch.addEventListener('click', function(element) {
    var currentStatus = toggleSwitch.innerHTML;
    chrome.storage.local.set({'status': currentStatus}, function(){
        toggleSwitch.innerHTML = buttonText[currentStatus];
        status.innerHTML = statusText[currentStatus];
    });
    chrome.runtime.sendMessage('', {
        type: 'toggle',
        options: currentStatus
    });
});
