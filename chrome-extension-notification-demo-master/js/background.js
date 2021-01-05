// chrome.runtime.onInstalled.addListener(function() {
//   chrome.storage.sync.set({color: '#3aa757'}, function() {
//     console.log('The color is green.');
//   });
//   chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
//     chrome.declarativeContent.onPageChanged.addRules([{
//       conditions: [new chrome.declarativeContent.PageStateMatcher({
//         pageUrl: {hostEquals: 'developer.chrome.com'},
//       })
//       ],
//           actions: [new chrome.declarativeContent.ShowPageAction()]
//     }]);
//   });
// });


function showNotification() {
    console.log('function');
    chrome.notifications.create('has', {
        type: 'list',
        iconUrl: '/icon.png',
        title: 'test2',
        message: '2 A new post has been found!',
        items: [
            {
              title: '7255205394',
              message: 'Free kids bike, gate, gazibo and a vaccum cleaner'
            },
            { title: '7255150131', message: 'Bike Helmet for Kids' }
        ]
    }, function(notificationId) {console.log(notificationId);});


}

// chrome.notifications.onButtonClicked.addListener(function(notificationId){
//     console.log(notificationId);
//     chrome.tabs.create({
//         url: 'https://www.amazon.com/'
//     });
// });

chrome.runtime.onMessage.addListener(data => {
  if (data.type === 'notification') {
      showNotification();
  }

});

// chrome.notifications.onClicked.addListener(function(notificationId){
//     console.log('onClicked');
//     if (notificationId == 'https://www.amazon.com/'){
//         console.log('test');
//     }
//     // chrome.tabs.create({
//     //     url: notificationId
//     // });
//     //chrome.runtime.sendMessage('hello world');
// });


// chrome.runtime.onMessage.addListener(data => {
//     console.log('sad');
//   if (data.type === 'notification') {
//     chrome.notifications.create('', data.options);
//   }
// });
