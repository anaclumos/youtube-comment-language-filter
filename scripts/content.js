var buttonPressed = false;
const config = { attributes: false, childList: true, subtree: true };
const callback = function (mutationsList, observer) {
  for (let mutation of mutationsList) {
    if (mutation.type === 'childList') {
      hideComments();
    }
  }
};
const observer = new MutationObserver(callback);


window.onload = () => {
  var CLFHeader = document.createElement('h2');
  CLFHeader.id = "CLFHeader";
  CLFHeader.textContent = "언어 필터";

  var CLFButton = document.createElement('button');
  CLFButton.id = "CLFButton";
  CLFButton.textContent = "한글";

  var CLFFooter = document.createElement('h2');
  CLFFooter.id = "CLFFooter";
  CLFFooter.textContent = "스크롤해서 댓글을 로딩하세요";

  var meta = document.getElementById('meta');
  var primary = document.getElementById('primary');

  meta.append(CLFHeader);
  meta.append(CLFButton);
  primary.append(CLFFooter);
  CLFButton.style
  CLFButton.addEventListener('click', () => {
    if (buttonPressed) {
      showComments();
      CLFButton.textContent = "한글";
      buttonPressed = false;
    }
    else {
      filterComments();
      CLFButton.textContent = "전체 언어";
      buttonPressed = true;
    }
  });
}

function containsUnicode(str, startUnicode, endUnicode) {
  for (var i = 0; i < str.length; i++) {
    if (startUnicode.charCodeAt(0) <= str.charCodeAt(i) && str.charCodeAt(i) <= endUnicode.charCodeAt(0)) {
      return true;
    }
  }
  return false;
}

function hideComments() {
  observer.disconnect();
  var commentList = document.getElementsByTagName("ytd-comment-thread-renderer");
  var comment;
  for (var x = 0; x < commentList.length; x++) {
    if (commentList[x].id == "nonKR-comment" && commentList[x].style == "display: none") {
      continue;
    }
    else if (commentList[x].id == "nonKR-comment" && commentList[x].style != "display: none") {
      commentList[x].style = "display: none";
      continue;
    }
    else {
      comment = commentList[x].childNodes[1].childNodes[1].childNodes[3].childNodes[3].childNodes[1].innerText;
      if (!containsUnicode(comment, "가", "힣")) {
        commentList[x].style = "display: none";
        commentList[x].id = "nonKR-comment";
      }
      else {
        commentList[x].id = "korean-comment";
      }
    }
  }
  const target = document.evaluate('/html/body/ytd-app/div/ytd-page-manager/ytd-watch-flexy/div[4]/div[1]/div/ytd-comments/ytd-item-section-renderer/div[3]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  observer.observe(target, config);
}

function showComments() {
  observer.disconnect();
  var commentList = document.getElementsByTagName("ytd-comment-thread-renderer");
  for (var x = 0; x < commentList.length; x++) {
    if (commentList[x].id == "nonKR-comment") {
      commentList[x].style = "";
    }
  }
}

function filterComments() {
  const target = document.evaluate('/html/body/ytd-app/div/ytd-page-manager/ytd-watch-flexy/div[4]/div[1]/div/ytd-comments/ytd-item-section-renderer/div[3]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  observer.observe(target, config);
  hideComments();
}