window.onload = () => {
  setLangtoEnglish();
  var langButton = document.getElementById("Language");
  langButton.addEventListener("change", function () {
    if (langButton.value == "English") {
      setLangtoEnglish();
    } else if (langButton.value == "Korean") {
      setLangtoKorean();
    }
  });
}

function setLangtoEnglish() {
  document.getElementById("main-text").innerHTML = `
      <h2>How to use YouTube Comment Language Filter</h2>
      <ol>
          <li>Click on the extension icon.</li>
          <li>Go to settings.</li>
          <li>Select comment language you want to see, and save.</li>
          <li>On the YouTube Watch page, there will be an option to filter comments below the description.</li>
          <li>If you have something to say, please contact me via <a
                  href="mailto:mail@chosunghyun.com">mail@chosunghyun.com</a></li>
      </ol>`
}

function setLangtoKorean() {
  document.getElementById("main-text").innerHTML = `
  <h2>YouTube 댓글 언어 필터를 사용하는 방법</h2>
  <ol>
      <li>확장 프로그램 아이콘을 클릭하세요.</li>
      <li>Settings를 누르세요.</li>
      <li>보고 싶은 댓글 언어들을 선택하고 Save를 눌러 저장하세요.</li>
      <li>YouTube 동영상 페이지 설명란 하단에 댓글을 필터링할 수 있는 언어 선택 메뉴가 생길 것입니다.</li>
      <li>문의 사항은 <a
              href="mailto:mail@chosunghyun.com">mail@chosunghyun.com</a>로 메일 부탁드립니다.</li>
  </ol>`
}