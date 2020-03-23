window.onload = () => {
  document.getElementById("save-button").addEventListener("click", function () {
    storeSetting();
  });
  checkSetting();
}

function storeSetting() {
  const EnglishDisabled = !document.getElementById("lang-english-checkbox").checked;
  const KoreanDisabled = !document.getElementById("lang-korean-checkbox").checked;
  const JapaneseDisabled = !document.getElementById("lang-japanese-checkbox").checked;
  const ChineseDisabled = !document.getElementById("lang-chinese-checkbox").checked;
  const setting = { EnglishDisabled: EnglishDisabled, KoreanDisabled: KoreanDisabled, JapaneseDisabled: JapaneseDisabled, ChineseDisabled: ChineseDisabled };
  chrome.storage.sync.set(setting, () => {
    console.log("Stored", setting);
    document.getElementById("save-button").innerHTML = "Saved!"
    setTimeout(function () {
      document.getElementById("save-button").innerHTML = "Save"
    }, 2000);
  });
}

function checkSetting() {
  chrome.storage.sync.get(['EnglishDisabled', 'KoreanDisabled', 'JapaneseDisabled', 'ChineseDisabled'], (result) => {
    console.log(result);
    document.getElementById("lang-english-checkbox").checked = !result.EnglishDisabled;
    document.getElementById("lang-korean-checkbox").checked = !result.KoreanDisabled;
    document.getElementById("lang-japanese-checkbox").checked = !result.JapaneseDisabled;
    document.getElementById("lang-chinese-checkbox").checked = !result.ChineseDisabled;
  });
}