chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log('The color is green.');
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'developer.chrome.com'},
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

function fetchURL(newURL){
    fetch(newURL, {
        mode:'no-cors'
    }).then(request => request.text())
    .then(function(text){
        console.log(text);
    })
    .catch((error) => {
        console.warn(error);
    });
}

async function findData(strURL, callback) {
    let req = new XMLHttpRequest();
    return new Promise(function(resolve, reject) {
        req.open("GET", strURL, true);
        req.onreadystatechange = function() {
            if (req.readyState == 4) {
                if (req.status == 200) {
                  console.info("Sucess!");
                  resolve(req.responseText);
                }
                else if (req.status == 404) console.info("URL doesn't exist!");
                else reject("Error: Status is " + req.status);
            }
        }
        req.send();
    });
}

function showNotification(newPosts) {
    chrome.notifications.create('', {
        type: 'list',
        iconUrl: 'images/craigslist.png',
        title: 'Craigslist Alert',
        message: 'A new post has been found!',
        items: newPosts.map(info => ({title: info[3], message: info[1]}))
     }, function(notificationId) {});
}

// chrome.notifications.onClicked.addListener(function(notificationId){
//     console.log('notified');
//     chrome.tabs.create({
//         url: 'https://www.product.co.ke/electronics-video/'
//     });
// });

function getURL(searchData){
    var keywords = searchData['keywords'];
    keywords = keywords.replaceAll('|', '%7C').replaceAll(' ', '%20');
    var newURL = 'https://sfbay.craigslist.org/search/sby/zip?query='
     + keywords + '&sort=date&search_distance=' + searchData['mileage']
     + '&postal=' + searchData['postcode'];
    return newURL;
}

const defaultValues = {
    'mileage': 10,
    'postcode': 95050,
    'keywords': 'bike | microwave | fan'
}
const keyValues = Object.keys(defaultValues);
let linkPattern = /<a href="(https:\/\/sfbay\.craigslist\.org\/sby\/zip\/d\/.*\.html)" data-id="(\d+)" class=".*" id="postid_\d+"\s*>(.*)<\/a>/gm;
let alarmName = 'craigslist';

// set default options if not already existing
chrome.storage.sync.get(keyValues, function(storedValues){
    if (! 'keywords' in storedValues || storedValues.keywords == null){
        chrome.storage.sync.set(defaultValues, function() {
            console.log(defaultValues);
            chrome.alarms.create(alarmName, {delayInMinutes: 1, periodInMinutes: 1});
        });
    }else{
        console.log('Use existing defaultValues.');
        chrome.alarms.create(alarmName, {delayInMinutes: 1, periodInMinutes: 1});
    }
});

// set up alarm to check new post
chrome.alarms.onAlarm.addListener(function(alarmName) {
    chrome.storage.sync.get(keyValues, async function(searchData) {
        var newURL = getURL(searchData);
        try {
            var webText = await findData(newURL);
            // console.log(webText);
        } catch (err) {
            console.log(err);
        }

        chrome.storage.local.get('craigslist_postids', function(data){
            var hasIds = 'craigslist_postids' in data;
            if (hasIds){
                var existingIds =  Array.from(data.craigslist_postids);
            }else{
                var existingIds = [];
            }
            // 1: link, 2: id, 3: title
            var allPosts = [...webText.matchAll(linkPattern)];
            var newPosts = allPosts.filter(
                match => !(existingIds.includes(match[2])));
            if (newPosts.length > 0){
                if (hasIds){
                    showNotification(newPosts);
                }
                console.log(newPosts.map(info => info[3]));
                existingIds = allPosts.map(info => info[2]);
                chrome.storage.local.set({'craigslist_postids': existingIds},
                    function(){
                        console.log("Saved a new array item");
                        console.log(existingIds);
                    });
            }else{
                console.log('No new post found!');
            }
        });
    });
});