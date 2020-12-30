let page = document.getElementById('buttonDiv');
const kButtonColors = ['#3aa757', '#e8453c', '#f9bb2d', '#4688f1'];
function constructOptions(kButtonColors) {
  for (let item of kButtonColors) {
    let button = document.createElement('button');
    button.style.backgroundColor = item;
    button.addEventListener('click', function() {
      chrome.storage.sync.set({color: item}, function() {
        console.log('color is ' + item);
      })
    });
    page.appendChild(button);
  }
}
constructOptions(kButtonColors);

const keyValues = ['mileage', 'postcode', 'keywords'];
function updateKeyValues(keyValues){
    for (let item of keyValues) {
        let inputElement = document.querySelector('input[name="' + item + '"]');
        inputElement.addEventListener('input', function updateValue(e){
          chrome.storage.sync.set({
              [item]: e.target.value,
          }, function() {
            console.log(item + ': ' + e.target.value);
          })
        });
    }
}
updateKeyValues(keyValues);
