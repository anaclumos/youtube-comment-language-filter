var debug = false;
chrome.storage.sync.get(['debugModeEnabled'], (result) => {
  debug = result.debugModeEnabled;
});

var commentNum = 0;
var shownCommentNum = 0;
var CLFSelect = document.createElement('select');
CLFSelect.id = "CLFSelect";
var CLFFooter = document.createElement('h2');
var CLFHeader = document.createElement('h2');
var CLFInterfaceShown = false;
var observer = new MutationObserver((mutationList) => {
  if (debug) {
    console.log("MutationObserver is trying to test newly loaded comments.");
  }
  observerRemoveComments();
});
var loc = window.location.href;

function containsSelectedLang(string, StartCharset, EndCharset) {
  if (debug) {
    console.log("containsSelectedLang: trying to test:", string);
  }
  var stlen = string.length;
  var i = 0;
  for (i = 0; i < stlen; i++) {
    for (var x = 0; x < StartCharset.length; x++) {
      if (StartCharset[x] <= string.charCodeAt(i) && string.charCodeAt(i) <= EndCharset[x]) {
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
  var commentList = document.getElementsByTagName("ytd-comment-thread-renderer");
  for (var i = commentNum; i < commentList.length; i++) {
    commentNum++;
    CLFFooter.textContent = shownCommentNum + " / " + commentNum;
    var commentString = commentList[i].childNodes[2].childNodes[2].childNodes[3].childNodes[3].childNodes[2].innerText;
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
  CLFFooter.textContent = "All comments";
  document.getElementById("CLFSelect").selectedIndex = 0;
  commentNum = 0;
  shownCommentNum = 0;
  if (debug) {
    console.log("showAllComments: displaying all comments.");
  }
  var commentList = document.getElementsByTagName("ytd-comment-thread-renderer");
  for (var comment of commentList) {
    comment.style = "";
  }
}

function observerRemoveComments() {
  if (CLFSelect.value == "All") {
    CLFFooter.textContent = "All comments";
    if (debug) {
      console.log("observerRemoveComments: Showing all comments.");
    }
  } else if (CLFSelect.value == "English") {
    if (debug) {
      console.log("observerRemoveComments: Showing English comments.");
    }
    onlyShow([65, 97], [90, 122]);
  } else if (CLFSelect.value == "Korean") {
    if (debug) {
      console.log("observerRemoveComments: Showing Korean comments.");
    }
    onlyShow([0xac00], [0xd7a3]);
  } else if (CLFSelect.value == "Japanese") {
    if (debug) {
      console.log("observerRemoveComments: Showing Japanese comments.");
    }
    onlyShow([0x3040], [0x30ff]);
  } else if (CLFSelect.value == "Chinese") {
    if (debug) {
      console.log("observerRemoveComments: Showing Chinese comments.");
    }
    onlyShow([0x4e00], [0x9FFF]);
  }
}

async function main(loc) {
  if (debug) {
    console.log("main: executing at: " + loc);
  }
  if (loc.substring(0, 29) == "https://www.youtube.com/watch") {
    if (debug) {
      console.log("This page is the video page.");
      console.log("CLFInterfaceShown is " + CLFInterfaceShown);
    }
    if (!CLFInterfaceShown) {
      chrome.storage.sync.get(['EnglishDisabled', 'KoreanDisabled', 'JapaneseDisabled', 'ChineseDisabled'], (result) => {
        var AllSelect = document.createElement("option");
        AllSelect.value = "All";
        AllSelect.innerHTML = "Any characters";
        CLFSelect.appendChild(AllSelect);
        if (!result.EnglishDisabled) {
          var EnglishSelect = document.createElement("option");
          EnglishSelect.value = "English";
          EnglishSelect.innerHTML = "Alphabets";
          CLFSelect.appendChild(EnglishSelect);
        } if (!result.KoreanDisabled) {
          var KoreanSelect = document.createElement("option");
          KoreanSelect.value = "Korean";
          KoreanSelect.innerHTML = "Korean characters (한글)";
          CLFSelect.appendChild(KoreanSelect);
        } if (!result.JapaneseDisabled) {
          var JapaneseSelect = document.createElement("option");
          JapaneseSelect.value = "Japanese";
          JapaneseSelect.innerHTML = "Japanese characters (仮名)";
          CLFSelect.appendChild(JapaneseSelect);
        } if (!result.ChineseDisabled) {
          var ChineseSelect = document.createElement("option");
          ChineseSelect.value = "Chinese";
          ChineseSelect.innerHTML = "Chinese characters (漢字)";
          CLFSelect.appendChild(ChineseSelect);
        }
        if (debug) {
          console.log("Successfully created the interface.");
        }

        CLFHeader.classList.add("select-text");
        CLFHeader.id = "CLFHeader";
        CLFHeader.classList.add("CLFHeader");
        CLFFooter.id = "CLFFooter";
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
          var meta = document.evaluate("/html/body/ytd-app/div/ytd-page-manager/ytd-watch-flexy/div[4]/div[1]/div/div[6]/div[3]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          var primary = document.evaluate("/html/body/ytd-app/div/ytd-page-manager/ytd-watch-flexy/div[4]/div[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          if (meta != null && meta.className != undefined && primary != null && primary.className != undefined) {
            if (debug) {
              console.log("Found meta and primary tags.");
              console.log("meta: ", meta);
              console.log("primary: ", primary);
            }
            meta.append(CLFHeader);
            meta.append(CLFSelect);
            primary.append(CLFFooter);
            CLFInterfaceShown = true;
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
            const config = { attributes: false, childList: true, subtree: true };
            const target = document.evaluate('/html/body/ytd-app/div/ytd-page-manager/ytd-watch-flexy/div[4]/div[1]/div/ytd-comments/ytd-item-section-renderer/div[3]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            observer.observe(target, config);
          }
          if (CLFSelect.value == "English") {
            if (debug) {
              console.log("The filter option is now English.");
            }
            showAllComments();
            onlyShow([65, 97], [90, 122]);
          } else if (CLFSelect.value == "Korean") {
            if (debug) {
              console.log("The filter option is now Korean.");
            }
            showAllComments();
            onlyShow([0xac00], [0xd7a3]);
          } else if (CLFSelect.value == "Japanese") {
            if (debug) {
              console.log("The filter option is now Japanese.");
            }
            showAllComments();
            onlyShow([0x3040], [0x30ff]);
          } else if (CLFSelect.value == "Chinese") {
            if (debug) {
              console.log("The filter option is now Chinese.");
            }
            showAllComments();
            onlyShow([0x4e00], [0x9FFF]);
          }
        });
      });
    }
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (debug) {
    console.log("Event listener is enabled.");
  }
  if (request.message === 'page moved!') {
    if (debug) {
      console.log("Page has moved.");
    }
    if (CLFInterfaceShown) {
      if (debug) {
        console.log("The filtering interface is already injected.");
      }
    }
    loc = request.url;
    showAllComments();
    observer.disconnect();
    main(loc);
  }
});

main(loc);