let openPage = document.getElementById('checkCraigslist');
chrome.storage.sync.get('color', function(data) {
  openPage.style.backgroundColor = data.color;
  openPage.setAttribute('value', data.color);
});

const keyValues = ['mileage', 'postcode', 'keywords', 'hasPic', 'postedToday'];
const statusText = {'Start': 'Monitoring...', 'Stop': 'Pause!'};
const buttonText = {'Start': 'Stop', 'Stop': 'Start'};
function getURL(searchData){
    var keywords = searchData['keywords'];
    keywords = keywords.replaceAll('|', '%7C').replaceAll(' ', '%20');
    if(keywords){
        keywords = "query=" + keywords + "&";
    }
    if (searchData['hasPic']) {
        hasPic = 'hasPic=1&'
    }else{
        hasPic = ''
    }
    if (searchData['postedToday']) {
        postedToday = 'postedToday=1&'
    }else{
        postedToday = ''
    }
    var newURL = 'https://sfbay.craigslist.org/search/sby/zip?'
     + keywords + 'sort=date&' + hasPic + postedToday
     + 'search_distance=' + searchData['mileage']
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

function addLinks(listOfDicts){
    if (listOfDicts != null){
        var postDiv = document.getElementById("newposts");
        while (postDiv.firstChild) {
            postDiv.removeChild(postDiv.lastChild);
        }
        var height = 100;
        for (const [index, dict] of listOfDicts.entries()) {
            let newDiv = document.createElement("div");
            newDiv.setAttribute('class', 'row');

            let newLink = document.createElement('a');
            newLink.id = 'postid' + dict['postId'];
            newLink.setAttribute('href', dict['postLink']);
            newLink.setAttribute('style', 'width:500px;margin-top:10px;margin-bottom:10px');
            newLink.setAttribute('target', '_blank');
            newLink.setAttribute('rel', 'noopener noreferrer');
            newLink.innerText = index + '. ' + dict['postName'];
            newLink.style.fontSize =  '16px';
            newDiv.appendChild(newLink);

            postDiv.appendChild(newDiv);
            height += 30;
        }
        postDiv.setAttribute("style","height:" + height + "px");
    }
}

chrome.storage.local.get('newPosts', function(data){
    if ('newPosts' in data){
        addLinks(data.newPosts);
    }
})
