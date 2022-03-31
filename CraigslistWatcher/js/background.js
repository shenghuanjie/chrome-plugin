const defaultValues = {
    'mileage': 25,
    'postcode': 94538,
    'keywords': '',
    'hasPic': false,
    'postedToday': true,
}
const keyValues = Object.keys(defaultValues);
let linkPattern = /<a href="(https:\/\/sfbay\.craigslist\.org\/.*\/zip\/d\/.*\.html)" data-id="(\d+)" class=".*" id="postid_\d+"\s*>(.*)<\/a>/gm;
let alarmName = 'craigslist';

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log('The color is green.');
  });

  // set default options if not already existing
  chrome.storage.sync.get(keyValues, function(storedValues){
      if (! 'keywords' in storedValues || storedValues.keywords == null){
          chrome.storage.sync.set(defaultValues, function() {
              console.log(defaultValues);
          });
      }else{
          console.log('Use existing defaultValues.');
      }
  });

  chrome.storage.local.set({'status': 'Start'}, function() {
      console.log('Installed...')});
});

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

chrome.runtime.onStartup.addListener(function(){
    chrome.storage.local.set({'status': 'Start'}, function() {
        console.log('Installed...')});
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
        req.open("GET", strURL + "&?cache="+(Math.random()*1000000), true);
        req.onreadystatechange = function() {
            if (req.readyState == 4) {
                if (req.status == 200) {
                  resolve(req.responseText);
                }
                else if (req.status == 404) console.info("URL doesn't exist!");
                else reject("Error: Status is " + req.status);
            }
        }
        req.send();
    });
}

function playSound(){
    new Audio('/sounds/notification.mp3').play();
}

function showNotification(newPosts) {
    playSound();
    chrome.notifications.create('', {
        type: 'basic',
        iconUrl: 'images/craigslist.png',
        title: 'Craigslist Alert',
        message: newPosts[0][3].slice(0, 62)
     }, function(notificationId) {});
}

// chrome.notifications.onClicked.addListener(function(notificationId){
//     console.log('notified');
//     chrome.tabs.create({
//         url: 'https://www.product.co.ke/electronics-video/'
//     });
// });



function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function getURL(searchData)
{
    var keywords = searchData["keywords"];
    var hasPic = "";
    var postedToday = "";
    var searchDistance = "search_distance=" + searchData['mileage'] + '&';
    var postcode = 'postal=' + searchData['postcode'] + '&';
    var sortOption = 'sort=date&';
    if (keywords === undefined) {
      keywords = "";
    }
    keywords = keywords.replaceAll('|', '%7C').replaceAll(' ', '+');
    if(keywords){
        keywords = "query=" + keywords + "&";
    }
    if (searchData["hasPic"]) {
        hasPic = "hasPic=1&"
    }else{
        hasPic = ""
    }
    if (searchData["postedToday"]) {
        postedToday = "postedToday=1&"
    }else{
        postedToday = ""
    }

    var urlArray = [hasPic, postedToday, searchDistance, postcode, searchDistance, sortOption];
    urlArray = shuffle(urlArray);

    var newURL = 'https://sfbay.craigslist.org/search/sby/zip?' + urlArray.join('')
    if( newURL.charAt(newURL.length - 1) == "&"){
      newURL = newURL.slice(0, -1)
    }
    return newURL;
}

// function getURL(searchData){
//     var keywords = searchData['keywords'];
//     keywords = keywords.replaceAll('|', '%7C').replaceAll(' ', '+');
//     if(keywords){
//         keywords = "query=" + keywords + "&";
//     }
//     if (searchData['hasPic']) {
//         hasPic = 'hasPic=1&'
//     }else{
//         hasPic = ''
//     }
//     if (searchData['postedToday']) {
//         postedToday = 'postedToday=1&'
//     }else{
//         postedToday = ''
//     }
//     var newURL = 'https://sfbay.craigslist.org/search/sby/zip?'
//      + keywords + 'sort=date&' + hasPic + postedToday
//      + 'search_distance=' + searchData['mileage']
//      + '&postal=' + searchData['postcode'];
//     return newURL;
// }

// set up alarm to check new post
const maxSavedPostIds=10000;
chrome.alarms.onAlarm.addListener(function(alarmName) {
    chrome.storage.sync.get(keyValues, async function(searchData) {
        var newURL = getURL(searchData);
        try {
            var webText = await findData(newURL);
            // console.log(webText);
        } catch (err) {
            console.log(err);
        }
        console.log("Searching: " + newURL);

        // avoid fetching nearby posts
        var stopIndex = webText.indexOf("from nearby");
        if (stopIndex != -1){
            webText = webText.substring(0, stopIndex);
        }

        chrome.storage.local.get('craigslist_postids', function(data){
            var hasIds = 'craigslist_postids' in data;
            var existingIds = [];
            if (hasIds){
                existingIds =  Array.from(data.craigslist_postids);
            }
            // 1: link, 2: id, 3: title
            var allPosts = [...webText.matchAll(linkPattern)];
            console.log(allPosts);
            var newPosts = allPosts.filter(
                match => !(existingIds.includes(match[2] + "_" + match[3])));
            console.log('' + newPosts.length + ': ' + hasIds);

            // we save new Posts as well as creating an notification.
            chrome.storage.local.set({
                'newPosts': newPosts.map(info => ({
                    postLink: info[1], postName: info[3], postId: info[2]}))
            }, function(){});

            if (newPosts.length > 0){
                if (hasIds){
                    showNotification(newPosts);
                }
                console.log(newPosts.map(info => info[3]));
                // add both post id and name to avoid id recycling
                let saveIds = allPosts.map(info => info[2] + "_" + info[3]);
                //saveIds has to be in front to keep latest IDs
                var idsToSave = saveIds.concat(existingIds);
                if (idsToSave.length > maxSavedPostIds){
                    idsToSave = idsToSave.slice(0, maxSavedPostIds);
                }
                chrome.storage.local.set({'craigslist_postids': idsToSave},
                    function(){
                        console.log("Saved a new array item");
                        console.log(saveIds);
                        //console.log("Existing post IDs:");
                        //console.log(existingIds);
                        //console.log("Saving post IDs:");
                        //console.log(idsToSave);
                    });
                console.log("webText: " + webText);
            }else{
                console.log('No new post found!');
                //console.log(allPosts);
                //let saveIds = allPosts.map(info => info[2]);
                //console.log("Current post IDs:");
                //console.log(saveIds);
                //console.log("Existing post IDs:");
                //console.log(existingIds);
            }
        });
    });
});


chrome.runtime.onMessage.addListener(data => {
  if (data.type === 'toggle') {
      if (data.options == 'Start'){
          chrome.alarms.create(alarmName, {delayInMinutes: 1, periodInMinutes: 1});
      }else{
          chrome.alarms.clear(alarmName, function(){});
      }
  }
});
