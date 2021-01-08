var extensionPage = 'https://chosunghyun.com/youtube-comment-language-filter'
var updateLogPage = 'https://chosunghyun.com/youtube-comment-language-filter/updates'

var showNotification = true
chrome.storage.sync.get(['updateNotificationDisabled'], (result) => {
  showNotification = !result.updateNotificationDisabled
  if (showNotification) {
    chrome.runtime.onInstalled.addListener(function (object) {
      if (object.reason === 'install') {
        chrome.notifications.create(extensionPage, {
          title: 'YCLF is now installed 😎',
          message: 'Click here to learn more about the extension!',
          iconUrl: './images/min-icon128.png',
          type: 'basic',
        })
      } else if (object.reason === 'update') {
        chrome.notifications.create(updateLogPage, {
          title: 'YCLF updated to v' + chrome.runtime.getManifest().version + ' 🚀',
          message: "Click here to check out what's new!",
          iconUrl: './images/min-icon128.png',
          type: 'basic',
        })
      }
    })
    chrome.notifications.onClicked.addListener(function (notificationId) {
      chrome.tabs.create({ url: notificationId })
    })
  }
})

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
  if (changeInfo.url) {
    chrome.tabs.sendMessage(tabId, {
      message: 'page moved!',
      url: changeInfo.url,
    })
  }
})
