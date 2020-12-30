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
    var newURL = "https://sfbay.craigslist.org/search/sby/zip?search_distance=15&postal=95050";

    console.log(searchData['mileage'] + ' is me');

    fetch("https://shenghuanjie.github.io/", {
        mode:'no-cors'
    }).then(request => request.text())
    .then(function(text){
        // webText = text.match("Huanjie Sheng");
        // console.log(webText);
        console.log(text);
    })
    .catch((error) => {
        console.warn(error);
    });

};
