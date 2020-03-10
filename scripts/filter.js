function containsUnicode(str, startUnicode, endUnicode) {
  for (var i = 0; i < str.length; i++) {
    if (startUnicode.charCodeAt(0) <= str.charCodeAt(i) && str.charCodeAt(i) <= endUnicode.charCodeAt(0)) {
      return true;
    }
  }
  return false;
}

function removeNonKRComments() {
  var commentList = document.getElementsByTagName("ytd-comment-thread-renderer");
  var comment;
  for (var x = 0; x < commentList.length; x++) {
    comment = commentList[x].childNodes[1].childNodes[1].childNodes[3].childNodes[3].childNodes[1].innerText;
    if (!containsUnicode(comment, "가", "힣")) {
      commentList[x].parentNode.removeChild(commentList[x]);
      x--;
    }
  }
}

const target = document.evaluate('/html/body/ytd-app/div/ytd-page-manager/ytd-watch-flexy/div[4]/div[1]/div/ytd-comments/ytd-item-section-renderer/div[3]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
const config = { attributes: true, childList: true, subtree: true };

const callback = function (mutationsList, observer) {
  for (let mutation of mutationsList) {
    if (mutation.type === 'childList') {
      observer.disconnect();
      removeNonKRComments();
      observer.observe(target, config);
    }
  }
};

const observer = new MutationObserver(callback);
observer.observe(target, config);