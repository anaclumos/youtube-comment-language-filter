var commentNum = 0;
var shownCommentNum = 0;
var CLFSelect = document.createElement('select');
CLFSelect.id = "CLFSelect";
var CLFFooter = document.createElement('h2');
var CLFHeader = document.createElement('h2');
var CLFInterfaceShown = false;
var observer = new MutationObserver((mutationList) => {
  // console.log("position 1");
  observerRemoveComments();
});
var loc = window.location.href;

function containsSelectedLang(string, StartCharset, EndCharset) {
  // console.log("position 2");
  var stlen = string.length;
  var i = 0;
  for (i = 0; i < stlen; i++) {
    for (var x = 0; x < StartCharset.length; x++) {
      if (StartCharset[x] <= string.charCodeAt(i) && string.charCodeAt(i) <= EndCharset[x]) {
        return true;
      }
    }
  }
  return false;
}

function onlyShow(StartCharset, EndCharset) {
  // console.log("position 3");
  var commentList = document.getElementsByTagName("ytd-comment-thread-renderer");
  for (var i = commentNum; i < commentList.length; i++) {
    commentNum++;
    CLFFooter.textContent = commentNum + " comments analyzed, " + shownCommentNum + " comments shown.";
    var commentString = commentList[i].childNodes[2].childNodes[2].childNodes[3].childNodes[3].childNodes[1].innerText;
    if (!containsSelectedLang(commentString, StartCharset, EndCharset)) {
      // console.log("불합격임 " + commentString);
      commentList[i].style = "display: none";
    } else {
      // console.log("합격 " + commentString);
      shownCommentNum++;
    }
  }
}

function showAllComments() {
  // console.log("position 4");
  var commentList = document.getElementsByTagName("ytd-comment-thread-renderer");
  for (var comment of commentList) {
    comment.style = "";
  }
}

function observerRemoveComments() {
  // console.log("position 5");
  if (CLFSelect.value == "All") {
    // console.log("Observer ALL");
  } else if (CLFSelect.value == "English") {
    // console.log("Observer Eng");
    onlyShow([65, 97], [90, 122]);
  } else if (CLFSelect.value == "Korean") {
    // console.log("Observer Kor");
    onlyShow([0xac00], [0xd7a3]);
  } else if (CLFSelect.value == "Japanese") {
    // console.log("Observer Jap");
    onlyShow([0x3040], [0x30ff]);
  } else if (CLFSelect.value == "Chinese") {
    // console.log("Observer Chi");
    onlyShow([0x4e00], [0x9FFF]);
  }
}

async function main(loc) {
  // console.log("position 6");
  if (loc.substring(0, 29) == "https://www.youtube.com/watch") {
    // console.log("position 7");
    if (!CLFInterfaceShown) {
      chrome.storage.sync.get(['EnglishDisabled', 'KoreanDisabled', 'JapaneseDisabled', 'ChineseDisabled'], (result) => {
        var AllSelect = document.createElement("option");
        AllSelect.value = "All";
        AllSelect.innerHTML = "All";
        CLFSelect.appendChild(AllSelect);
        if (!result.EnglishDisabled) {
          var EnglishSelect = document.createElement("option");
          EnglishSelect.value = "English";
          EnglishSelect.innerHTML = "English";
          CLFSelect.appendChild(EnglishSelect);
        } if (!result.KoreanDisabled) {
          var KoreanSelect = document.createElement("option");
          KoreanSelect.value = "Korean";
          KoreanSelect.innerHTML = "Korean (한국어)";
          CLFSelect.appendChild(KoreanSelect);
        } if (!result.JapaneseDisabled) {
          var JapaneseSelect = document.createElement("option");
          JapaneseSelect.value = "Japanese";
          JapaneseSelect.innerHTML = "Japanese (日本語)";
          CLFSelect.appendChild(JapaneseSelect);
        } if (!result.ChineseDisabled) {
          var ChineseSelect = document.createElement("option");
          ChineseSelect.value = "Chinese";
          ChineseSelect.innerHTML = "Chinese (中文)";
          CLFSelect.appendChild(ChineseSelect);
        }
        // console.log("position 8");
      });

      CLFHeader.classList.add("select-text");
      CLFHeader.id = "CLFHeader";
      CLFHeader.classList.add("CLFHeader");
      CLFFooter.id = "CLFFooter";
      CLFFooter.classList.add("CLFFooter");
      CLFInterfaceShown = true;

      CLFHeader.textContent = "Comment Language Filter";
      CLFFooter.textContent = "Filter Off";
      // console.log("position 10");
      CLFSelect.addEventListener("change", function () {
        // console.log("position 11")
        if (CLFSelect.value == "All") {
          // console.log("Setting Changed to ALL");
          showAllComments();
          commentNum = 0;
          shownCommentNum = 0;
        } else {
          // const config = { attributes: false, childList: true, subtree: true };
          // const target = document.evaluate('/html/body/ytd-app/div/ytd-page-manager/ytd-watch-flexy/div[4]/div[1]/div/ytd-comments/ytd-item-section-renderer/div[3]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          observer.observe(target, config);
        }
        if (CLFSelect.value == "English") {
          // console.log("Setting Changed to Eng");
          showAllComments();
          commentNum = 0;
          shownCommentNum = 0;
          onlyShow([65, 97], [90, 122]);
        } else if (CLFSelect.value == "Korean") {
          // console.log("Setting Changed to Kor");
          showAllComments();
          commentNum = 0;
          shownCommentNum = 0;
          onlyShow([0xac00], [0xd7a3]);
        } else if (CLFSelect.value == "Japanese") {
          // console.log("Setting Changed to Jap");
          showAllComments();
          commentNum = 0;
          shownCommentNum = 0;
          onlyShow([0x3040], [0x30ff]);
        } else if (CLFSelect.value == "Chinese") {
          // console.log("Setting Changed to Chi");
          showAllComments();
          commentNum = 0;
          shownCommentNum = 0;
          onlyShow([0x4e00], [0x9FFF]);
        }
      });
      (function insertEl() {
        var meta = document.evaluate("/html/body/ytd-app/div/ytd-page-manager/ytd-watch-flexy/div[4]/div[1]/div/div[7]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        var primary = document.evaluate("/html/body/ytd-app/div/ytd-page-manager/ytd-watch-flexy/div[4]/div[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (meta != null && meta.className != undefined && primary != null && primary.className != undefined) {
          // console.log("found meta and primary");
          meta.append(CLFHeader);
          meta.append(CLFSelect);
          primary.append(CLFFooter);
        } else {
          // console.log("Couldn't find Meta or Primary. ");
          // console.log("Meta is", meta);
          // console.log("Primary is", primary)
          setTimeout(insertEl, 500);
        }
      })();
    } else {
    }
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // console.log("position 12");
  if (request.message === 'page moved!') {
    if (CLFInterfaceShown) {
      document.getElementById("CLFSelect").selectedIndex = 0;
      CLFFooter.textContent = "Filter Off";
    }
    loc = request.url;
    showAllComments();
    main(loc);
  }
});

main(loc);