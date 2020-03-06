function containsUnicode(str, startUnicode, endUnicode) {
  for (var i = 0; i < str.length; i++) {
    if (startUnicode.charCodeAt(0) <= str.charCodeAt(i) && str.charCodeAt(i) <= endUnicode.charCodeAt(0)) {
      return true;
    }
  }
  return false
}

function removeNonKRComments() {
  var commentList = document.getElementsByTagName("ytd-comment-thread-renderer");
  var comment;

  for (var x = 0; x < commentList.length; x++) {
    comment = commentList[x].childNodes[1].childNodes[1].childNodes[3].childNodes[3].innerText;
    if (containsUnicode(comment, "가", "힣")) {
      console.log("한글인듯: "+ comment);
    }
    else {
      console.log("영어인듯. 지움 ㅋㅋ: "+ comment);
      commentList[x].parentNode.removeChild(commentList[x]);
      x--;
    }
  }
}

// Select the node that will be observed for mutations
const target = document.evaluate('/html/body/ytd-app/div/ytd-page-manager/ytd-watch-flexy/div[4]/div[1]/div/ytd-comments/ytd-item-section-renderer/div[3]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            console.log('A child node has been added or removed.');
            observer.disconnect();
            removeNonKRComments();
            console.log('And Stuffs got removed.');
            observer.observe(target, config);
        }
        else if (mutation.type === 'attributes') {
            console.log('The ' + mutation.attributeName + ' attribute was modified.');
        }
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(target, config);