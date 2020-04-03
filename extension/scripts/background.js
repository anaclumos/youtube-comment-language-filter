chrome.runtime.onInstalled.addListener(function (object) {
  if (object.reason === 'install') {
    chrome.tabs.create({ url: "https://chosunghyun.com/youtube-comment-language-filter" }, function (tab) {
      // console.log("New tab launched with http://yoursite.com/");
    });
  }
});

chrome.tabs.onUpdated.addListener(
  function (tabId, changeInfo) {
    if (changeInfo.url) {
      chrome.tabs.sendMessage(tabId, {
        message: 'page moved!',
        url: changeInfo.url
      })
    }
  }
);