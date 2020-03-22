chrome.runtime.onInstalled.addListener(function (object) {
  chrome.tabs.create({ url: "https://chosunghyun.com/youtube-comment-language-filter" }, function (tab) {
    //console.log("");
  });
});

chrome.tabs.onUpdated.addListener(
  function (tabId, changeInfo, tab) {
    // read changeInfo data and do something with it
    // like send the new url to contentscripts.js
    if (changeInfo.url) {
      chrome.tabs.sendMessage(tabId, {
        message: 'page moved!',
        url: changeInfo.url
      })
    }
  }
);