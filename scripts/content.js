window.onload = () => {
  var CLFButton = document.createElement('button');
  CLFButton.id = "CommentLanguageFilterButton";
  CLFButton.textContent = "Filter"
  var primary = document.getElementById('meta')
  primary.append(CLFButton)
  CLFButton.addEventListener('click', () => console.log("Filter Button Clicked"));
}