var CLFSelect = document.createElement("select");
CLFSelect.id = "CLFSelect";
var CLFFooter = document.createElement("h2");
CLFFooter.id = "CLFFooter";
var CLFHeader = document.createElement("h2");
CLFHeader.id = "CLFHeader";
var CLFShown = false;
var loc = window.location.href;
var commentNum = 0;
var shownCommentNum = 0;
var debug = false;
var observer = new MutationObserver((mutationList) => {
  if (debug) {
    console.log("MutationObserver is trying to test newly loaded comments.");
  }
  removeComments();
});
chrome.storage.sync.get(["debugModeEnabled"], (result) => {
  debug = result.debugModeEnabled;
});

function containsSelectedLang(string, StartCharset, EndCharset) {
  if (debug) {
    console.log("containsSelectedLang: trying to test:", string);
  }
  var stlen = string.length;
  var i = 0;
  for (i = 0; i < stlen; i++) {
    for (var x = 0; x < StartCharset.length; x++) {
      if (
        StartCharset[x] <= string.charCodeAt(i) &&
        string.charCodeAt(i) <= EndCharset[x]
      ) {
        if (debug) {
          console.log("Result: True\n");
        }
        return true;
      }
    }
  }
  if (debug) {
    console.log("Result: False\n");
  }
  return false;
}

function onlyShow(StartCharset, EndCharset) {
  var commentList = document.getElementsByTagName(
    "ytd-comment-thread-renderer"
  );
  for (var i = commentNum; i < commentList.length; i++) {
    commentNum++;
    CLFFooter.textContent = shownCommentNum + " / " + commentNum;
    var commentString =
      commentList[i].childNodes[2].childNodes[2].childNodes[3].childNodes[3]
        .childNodes[2].innerText;
    if (debug) {
      console.log("\nTesting started for comment#" + commentNum);
    }
    if (!containsSelectedLang(commentString, StartCharset, EndCharset)) {
      commentList[i].style = "display: none";
    } else {
      shownCommentNum++;
    }
  }
}

function showAllComments() {
  commentNum = 0;
  shownCommentNum = 0;
  if (debug) {
    console.log("showAllComments: displaying all comments.");
  }
  var commentList = document.getElementsByTagName(
    "ytd-comment-thread-renderer"
  );
  for (var comment of commentList) {
    comment.style = "";
  }
}

function removeComments() {
  if (CLFSelect.value == "All") {
    CLFFooter.textContent = "All comments";
    if (debug) {
      console.log("removeComments: Showing all comments.");
    }
  } else if (CLFSelect.value == "English") {
    if (debug) {
      console.log("removeComments: Showing English comments.");
    }
    onlyShow([65, 97], [90, 122]);
  } else if (CLFSelect.value == "Korean") {
    if (debug) {
      console.log("removeComments: Showing Korean comments.");
    }
    onlyShow([0xac00], [0xd7a3]);
  } else if (CLFSelect.value == "Japanese") {
    if (debug) {
      console.log("removeComments: Showing Japanese comments.");
    }
    onlyShow([0x3040], [0x30ff]);
  } else if (CLFSelect.value == "Chinese") {
    if (debug) {
      console.log("removeComments: Showing Chinese comments.");
    }
    onlyShow([0x4e00], [0x9fff]);
  }
}

async function main(loc) {
  if (debug) {
    console.log("main: executing at: " + loc);
  }
  if (loc.substring(0, 29) == "https://www.youtube.com/watch") {
    if (debug) {
      console.log("This page is the video page: " + loc);
    }
    if (!CLFShown) {
      chrome.storage.sync.get(
        [
          "EnglishDisabled",
          "KoreanDisabled",
          "JapaneseDisabled",
          "ChineseDisabled",
        ],
        (result) => {
          var AllSelect = document.createElement("option");
          AllSelect.value = "All";
          AllSelect.innerHTML = "Any characters";
          CLFSelect.appendChild(AllSelect);
          if (!result.EnglishDisabled) {
            var EnglishSelect = document.createElement("option");
            EnglishSelect.value = "English";
            EnglishSelect.innerHTML = "Alphabets";
            CLFSelect.appendChild(EnglishSelect);
          }
          if (!result.KoreanDisabled) {
            var KoreanSelect = document.createElement("option");
            KoreanSelect.value = "Korean";
            KoreanSelect.innerHTML = "Korean characters (한글)";
            CLFSelect.appendChild(KoreanSelect);
          }
          if (!result.JapaneseDisabled) {
            var JapaneseSelect = document.createElement("option");
            JapaneseSelect.value = "Japanese";
            JapaneseSelect.innerHTML = "Japanese characters (仮名)";
            CLFSelect.appendChild(JapaneseSelect);
          }
          if (!result.ChineseDisabled) {
            var ChineseSelect = document.createElement("option");
            ChineseSelect.value = "Chinese";
            ChineseSelect.innerHTML = "Chinese characters (漢字)";
            CLFSelect.appendChild(ChineseSelect);
          }
          if (debug) {
            console.log("Successfully created the interface.");
          }
        }
      );
      CLFHeader.classList.add("select-text");
      CLFHeader.classList.add("CLFHeader");
      CLFFooter.classList.add("CLFFooter");
      CLFHeader.textContent = "Comments must include:";
      CLFFooter.textContent = "All comments";
      if (debug) {
        console.log(CLFHeader);
        console.log(CLFSelect);
        console.log(CLFFooter);
        console.log("Interface text set.");
      }
      (function insertEl() {
        var meta = document.evaluate(
          "/html/body/ytd-app/div/ytd-page-manager/ytd-watch-flexy/div[4]/div[1]/div/div[6]",
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;
        var primary = document.evaluate(
          "/html/body/ytd-app/div/ytd-page-manager/ytd-watch-flexy/div[4]/div[1]",
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;
        if (
          meta != null &&
          meta.className != undefined &&
          primary != null &&
          primary.className != undefined
        ) {
          if (debug) {
            console.log("Found meta and primary tags.");
            console.log("meta: ", meta);
            console.log("primary: ", primary);
          }
          meta.append(CLFHeader);
          meta.append(CLFSelect);
          primary.append(CLFFooter);
          CLFShown = true;
        } else {
          if (debug) {
            console.log("Unable to find meta and primary tags");
            console.log("meta: ", meta);
            console.log("primary: ", primary);
          }
          setTimeout(insertEl, 200);
        }
      })();
      CLFSelect.addEventListener("change", function () {
        if (debug) {
          console.log("The filter option is modified.");
        }
        if (CLFSelect.value == "All") {
          if (debug) {
            console.log("The filter option is now All.");
          }
          CLFFooter.textContent = "All comments";
          observer.disconnect();
          showAllComments();
        } else {
          const config = {
            attributes: false,
            childList: true,
            subtree: true,
          };
          const target = document.evaluate(
            "/html/body/ytd-app/div/ytd-page-manager/ytd-watch-flexy/div[4]/div[1]/div/ytd-comments/ytd-item-section-renderer/div[3]",
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue;
          showAllComments();
          removeComments();
          observer.observe(target, config);
        }
      });
      showAllComments();
      removeComments();
    }
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (debug) {
    console.log("Event listener is enabled.");
  }
  if (request.message === "page moved!") {
    if (debug) {
      console.log("Page has moved.");
    }
    loc = request.url;
    CLFFooter.textContent = "All comments";
    document.getElementById("CLFSelect").selectedIndex = 0;
    showAllComments();
    observer.disconnect();
    main(loc);
  }
});

main(loc);
