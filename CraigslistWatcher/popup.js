let changeColor = document.getElementById('checkCraigslist');
chrome.storage.sync.get('color', function(data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
});

let searchData = {};
const keyValues = ['mileage', 'postcode', 'keywords'];
for (let item of keyValues) {
    chrome.storage.sync.get([item], function(data) {
        searchData[item] = data[item];
    });
}

changeColor.onclick = function(element) {
    var color = element.target.value;
    var keywords = searchData['keywords'];
    keywords = keywords.replaceAll('|', '%7C').replaceAll(' ', '+')
    var newURL = 'https://sfbay.craigslist.org/search/sby/zip?query='
     + keywords + '&search_distance=' + searchData['mileage']
     + '&postal=' + searchData['postcode'];
    console.log(newURL);

    // fetch(newURL, {
    //     mode:'no-cors'
    // }).then(request => request.text())
    // .then(function(text){
    //     // webText = text.match("Huanjie Sheng");
    //     // console.log(webText);
    //     console.log(text);
    // })
    // .catch((error) => {
    //     console.warn(error);
    // });

};
