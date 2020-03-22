window.onload = () => {
  document.getElementById("save-button").addEventListener("click", function () {
    storeSetting();
  });
  checkSetting();
}

function storeSetting() {
  const EnglishEnabled = document.getElementById("lang-english-checkbox").checked;
  const KoreanEnabled = document.getElementById("lang-korean-checkbox").checked;
  const JapaneseEnabled = document.getElementById("lang-japanese-checkbox").checked;
  const ChineseEnabled = document.getElementById("lang-chinese-checkbox").checked;
  const setting = { English: EnglishEnabled, Korean: KoreanEnabled, Japanese: JapaneseEnabled, Chinese: ChineseEnabled };
  chrome.storage.sync.set(setting, () => {
    console.log("Stored", setting);
  });
}

function checkSetting() {
  chrome.storage.sync.get(['English', 'Korean', 'Japanese', 'Chinese'], (result) => {
    console.log(result);
    document.getElementById("lang-english-checkbox").checked = result.English;
    document.getElementById("lang-korean-checkbox").checked = result.Korean;
    document.getElementById("lang-japanese-checkbox").checked = result.Japanese;
    document.getElementById("lang-chinese-checkbox").checked = result.Chinese;
  });
}