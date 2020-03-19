async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function wait(ms) {
  await sleep(ms);
}

function containsSelectedLang(string) {
  var stlen = string.length;
  var i = 0;
  // console.log("string is " + string);
  for (i = 0; i < stlen; i++) {
    if (44032 <= string.charCodeAt(i) && string.charCodeAt(i) <= 55203) {
      // console.log("판정: 이건 한글이다. 왜? " + i + "번째인 '" + string.substring(i, i + 1) + "' 한글이라..");
      return true;
    }
  }
  // console.log("이건 한글이 아닌듯~");
  return false;
}

function onlyShowSelectedLangComments() {
  filteredLoc = loc;
  // console.log("filteredLoc is now " + filteredLoc);
  var commentList = document.getElementsByTagName("ytd-comment-thread-renderer");
  var filterNum = 0;
  for (var comment of commentList) {
    filterNum++;
    CLFFooter.textContent = filterNum + "개의 댓글을 분석했습니다...";
    if (comment.id === "") {
      var commentString = comment.childNodes[1].childNodes[1].childNodes[3].childNodes[3].childNodes[1].innerText;
      if (containsSelectedLang(commentString)) {
        comment.id = "contains-SelectedLang";
      } else {
        comment.id = "no-SelectedLang";
      }
    }
    if (comment.id === "no-SelectedLang") {
      comment.style = "display: none";
      // console.log("hided one comment.");
    }
  }
}

function showAllComments() {
  var commentList = document.getElementsByTagName("ytd-comment-thread-renderer");
  for (var comment of commentList) {
    comment.style = "";
  }
}

function resetAllCommentID() {
  var commentList = document.getElementsByTagName("ytd-comment-thread-renderer");
  for (var comment of commentList) {
    comment.id = "";
  }
  // console.log("Reseted all comments.");
  // console.log(commentList);
}

var observer = new MutationObserver((mutationList) => {
  onlyShowSelectedLangComments();
});

var CLFInterfaceShown = false;
var CLFOn = false;

async function main(loc) {
  if (loc.substring(0, 29) == "https://www.youtube.com/watch") {
    if (filteredLoc != loc && CLFInterfaceShown) {
      // console.log("새로운 동영상으로 들어왔군요! 필터 리셋합니다.")
      resetAllCommentID();
      showAllComments();
      CLFButton.textContent = "한글 댓글";
      CLFFooter.textContent = "전체 댓글입니다.";
    }
    if (!CLFInterfaceShown) {
      // console.log("적용할 도메인이다! " + loc);
      var CLFButton = document.createElement('button');
      CLFButton.id = "CLFButton";
      CLFButton.style =
        `position: relative; box-sizing: border-box; border: none; border-radius: 2px; padding: 10px 16px; min-width: 64px;
         vertical-align: middle; text-align: center; font-family: Roboto, Arial, sans-serif; font-size: 14px;
         font-weight: 500; outline: none; cursor: pointer; background-color: transparent; color: rgb(133, 133, 133);`;
      var CLFFooter = document.createElement('h2');
      CLFFooter.id = "CLFFooter";
      CLFFooter.style = "text-align: center; color: rgb(133, 133, 133); margin-bottom: 100px;";

      var meta = document.evaluate("/html/body/ytd-app/div/ytd-page-manager/ytd-watch-flexy/div[4]/div[1]/div/div[7]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      var primary = document.evaluate("/html/body/ytd-app/div/ytd-page-manager/ytd-watch-flexy/div[4]/div[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

      while (meta.className === undefined) {
        // console.log("meta not found");
        wait(2000);
        meta = document.evaluate("/html/body/ytd-app/div/ytd-page-manager/ytd-watch-flexy/div[4]/div[1]/div/div[7]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      }

      while (primary.className === undefined) {
        // console.log("primary not found");
        wait(2000);
        primary = document.evaluate("/html/body/ytd-app/div/ytd-page-manager/ytd-watch-flexy/div[4]/div[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      }

      // console.log(meta);
      // console.log(primary);

      meta.append(CLFButton);
      primary.append(CLFFooter);
      CLFInterfaceShown = true;

      CLFButton.textContent = "한글 댓글";
      CLFFooter.textContent = "전체 댓글입니다.";

      CLFButton.addEventListener('click', () => {
        if (CLFOn) {
          CLFOn = false;
          showAllComments();
          CLFButton.textContent = "한글 댓글";
          CLFFooter.textContent = "전체 댓글입니다.";
          observer.disconnect();
        } else {
          CLFOn = true;
          onlyShowSelectedLangComments();
          CLFButton.textContent = "전체 댓글";
          const config = { attributes: false, childList: true, subtree: true };
          const target = document.evaluate('/html/body/ytd-app/div/ytd-page-manager/ytd-watch-flexy/div[4]/div[1]/div/ytd-comments/ytd-item-section-renderer/div[3]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          observer.observe(target, config);
        }
      });
    } else {
      // console.log("적용할 도메인이 아닌듯: " + loc);
    }
  }
}

var loc = window.location.href;
var filteredLoc = "";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  observer.disconnect();
  if (request.message === 'page moved!') {
    if (CLFInterfaceShown) {
      CLFButton.textContent = "한글 댓글";
      CLFFooter.textContent = "전체 댓글입니다.";
    }
    loc = request.url;
    CLFOn = false;
    resetAllCommentID();
    // // console.log("새 웹사이트 감지! " + loc);
    main(loc);
  }
});

main(loc);