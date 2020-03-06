# YouTube Comment Language Filter

```javascript
for (var x = 0; x < commentList.length; x++) {
	console.log(commentList[x].childNodes[1].childNodes[1].childNodes[3].childNodes[1].innerText);
	// "name\ndate"

	console.log(commentList[x].childNodes[1].childNodes[1].childNodes[3].childNodes[3].innerText);
	// comment text value
}
```

The following tag appears for a very short time when the spinning loading indicator thing is visible
```
can-show-more
```

YouTube Comment Section `Xpath`
```html
/html/body/ytd-app/div/ytd-page-manager/ytd-watch-flexy/div[4]/div[1]/div/ytd-comments/ytd-item-section-renderer/div[3]
```