async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function wait(ms) {
  await sleep(ms);
}

function containsHangul(string) {
  var stlen = string.length;
  var i = 0;
  for (i = 0; i < stlen; i++) {
    if (44032 <= string.charCodeAt(i) && string.charCodeAt(i) <= 55203) {
      return true;
    }
  }
  return false;
}

function onlyShowHangulComments() {
  var commentList = document.getElementsByTagName("ytd-comment-thread-renderer");
  for (var comment of commentList) {
    if (comment.id === "") {
      var commentString = comment.childNodes[1].childNodes[1].childNodes[3].childNodes[3].childNodes[1].innerText;
      if (containsHangul(commentString)) {
        comment.id = "contains-hangul";
      } else {
        comment.id = "no-hangul";
      }
    }
    if (comment.id === "no-hangul") {
      comment.style = "display: none";
      console.log("hided one comment.");
    }
  }
}

var observer = new MutationObserver((mutationList) => {
  onlyShowHangulComments();
});

window.onload = () => {
  console.log("onload");
  var CLFButton = document.createElement('button');
  CLFButton.id = "CLFButton";
  CLFButton.style =
    `position: relative; box-sizing: border-box; border: none; border-radius: 2px; padding: 10px 16px; min-width: 64px;
   vertical-align: middle; text-align: center; font-family: Roboto, Arial, sans-serif; font-size: 14px;
   font-weight: 500; outline: none; cursor: pointer; background-color: transparent; color: rgb(133, 133, 133);`;
  var CLFFooter = document.createElement('h2');
  CLFFooter.id = "CLFFooter";
  CLFFooter.style = "text-align: center; color: rgb(133, 133, 133); margin-bottom: 100px;";

  var meta = document.getElementById("meta");;
  var primary = document.getElementById("primary");;

  while (meta === undefined) {
    wait(2000);
    meta = document.getElementById("meta");
  }

  while (primary === undefined) {
    wait(2000);
    primary = document.getElementById("primary");
  }

  console.log("meta is " + meta);
  console.log("primary is " + primary);

  meta.append(CLFButton);
  primary.append(CLFFooter);

  CLFButton.textContent = "한글을 포함한 댓글만 보기";
  CLFFooter.textContent = "한글을 포함한 댓글만 보는 중입니다.";

  CLFButton.addEventListener('click', () => {
    onlyShowHangulComments();
    const config = { attributes: false, childList: true, subtree: true };
    const target = document.evaluate('/html/body/ytd-app/div/ytd-page-manager/ytd-watch-flexy/div[4]/div[1]/div/ytd-comments/ytd-item-section-renderer/div[3]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    observer.observe(target, config);
  });
}