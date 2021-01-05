var text = '<a href="https://sfbay.craigslist.org/sby/zip/d/milpitas-metal-desk-tools/7253428310.html" data-id="7253428310" class="result-title hdrlnk md-opjjpmhoiojifppkkcdabiobhakljdgm_doc" id="postid_7253428310">Metal desk (tools)</a>'
var text2 = '<a href="https://sfbay.craigslist.org/sby/zip/d/san-jose-panasonic-1200-watt-microwave/7255471518.html" data-id="7255471518" class="result-title hdrlnk" id="postid_7255471518" >Panasonic 1200 Watt Microwave, 1.2 cubic ft</a>'
var pattern = /<a href="(https:\/\/sfbay\.craigslist\.org\/sby\/zip\/d\/.*\.html)" data-id="(\d+)" class=".*" id="postid_\d+"\s*>(.*)<\/a>/gm;
// var webText = text.matchAll(pattern);
// const array = [...text.matchAll(pattern)];
// console.log(array[0]);
// for (var match of webText) {
//   console.log(match);
// }
//
// var webText = text2.matchAll(pattern);
// // const array = [...text.matchAll(regexp)];
// for (var match of webText) {
//   console.log(match);
// }

//
// var text2 = 'a 1 b 2'
// var regexp = /([abc]) \d+/g
// const array = [...text2.matchAll(regexp)];
// for (var match of array) {
//   console.log(match);
// }
//
//
// var a = [1,2,3];
// var b = [4,5,6];
// a.unshift(...b);
// console.log(a);
//

// var client = new XMLHttpRequest();
// client.open('GET', '/foo.txt');
// client.onreadystatechange = function() {
//   alert(client.responseText);
// }
// client.send();
// console.log(module.paths);
// const jquery = require( "C:/Users/david/AppData/Roaming/npm/node_modules/jquery" );
var filePath = "C:/Users/david/Desktop/test.log";
//
// let existingId = ["7255471518",
//   '7255205394', '7255150131',
//   '7254730332', '7254127087',
//   '7253478649', '7253099667',
//   '7252768336', '7255529692',
//   '7255459063', '7252131752',
//   '7252893541', '7255512278',
//   '7255440128', '7255471518'
// ];

let existingId = ["7255471518"];

const fs = require('fs');
fs.readFile(filePath, 'utf-8', (err, textString) => {
if(err) { throw err; }
// console.log('data: ', textString);
var webResults = textString.matchAll(pattern);
var newPosts = [...webResults].filter(match => !(existingId.includes(match[2])));
// console.log(newPosts.map(info => ({title: info[2], message: info[3]})));

 // console.log(newPosts.map(info => info[2]));

  //existingId.unshift(...newPosts.map(info => info[2]));
  //console.log(existingId);
});


var a = '1234567890'
console.log(a.slice(0, 100))

// let a = Array.from([1,2,3]);
// console.log(a);
