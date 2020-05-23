window.onload = () => {
    document.getElementById("copy-installation-url").addEventListener("click", function () {
        
        var tempElem = document.createElement('textarea');
        tempElem.value = "https://chrome.google.com/webstore/detail/youtube-comment-language/pliobnchkbenbollnjaaojhbjkjgfkni?hl=ko";
        document.body.appendChild(tempElem);
        tempElem.select();
        document.execCommand("copy");
        document.body.removeChild(tempElem);

        document.getElementById("copy-installation-url").innerText = "Copied to Clipboard!";
        setTimeout(function () {
            document.getElementById("copy-installation-url").innerText = "Copy Store Link";
        }, 2000);

    });
}