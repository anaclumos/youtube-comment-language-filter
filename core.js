var commentList = document.getElementsByTagName("ytd-comment-thread-renderer");
var comment;

function containsUnicode(str, startUnicode, endUnicode) {
	for (var i = 0; i < str.length; i++) {
		if (startUnicode.charCodeAt(0) <= str.charCodeAt(i) && str.charCodeAt(i) <= endUnicode.charCodeAt(0)) {
			return true;
		}
	}
	return false
}

for (var x = 0; x < commentList.length; x++) {
	comment = commentList[x].childNodes[1].childNodes[1].childNodes[3].childNodes[3].innerText;
	if(containsUnicode(comment, "가", "힣")) {
		// comment = "한글임 \n" + comment;
	}
	else {
		// console.log(typeof commentList[x]);
		commentList[x].parentNode.removeChild(commentList[x]);
		x--;
	}
}

for (var x = 0; x < commentList.length; x++) {
	console.log(commentList[x].childNodes[1].childNodes[1].childNodes[3].childNodes[1].innerText);
	// 작성자 이름과 작성날짜가 같이 묶여있다. "이름\n작성날짜"

	console.log(commentList[x].childNodes[1].childNodes[1].childNodes[3].childNodes[3].innerText);
	// 댓글!
}