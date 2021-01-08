const chromeStoreUrl =
  'https://chrome.google.com/webstore/detail/youtube-comment-language/pliobnchkbenbollnjaaojhbjkjgfkni'
const firefoxStoreUrl = 'https://addons.mozilla.org/firefox/addon/yclf/'

window.onload = () => {
  document.getElementById('copy-chrome-url').addEventListener('click', function () {
    var tempElem = document.createElement('textarea')
    tempElem.value = chromeStoreUrl
    document.body.appendChild(tempElem)
    tempElem.select()
    document.execCommand('copy')
    document.body.removeChild(tempElem)
    document.getElementById('copy-chrome-url').innerText = 'Copied!'
    setTimeout(function () {
      document.getElementById('copy-chrome-url').innerText = 'Chrome Extension Store Link'
    }, 2000)
  })
  document.getElementById('copy-firefox-url').addEventListener('click', function () {
    var tempElem = document.createElement('textarea')
    tempElem.value = firefoxStoreUrl
    document.body.appendChild(tempElem)
    tempElem.select()
    document.execCommand('copy')
    document.body.removeChild(tempElem)
    document.getElementById('copy-firefox-url').innerText = 'Copied!'
    setTimeout(function () {
      document.getElementById('copy-firefox-url').innerText = 'Firefox Add-ons Store Link'
    }, 2000)
  })
}
