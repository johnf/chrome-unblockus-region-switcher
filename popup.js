function clickHandler(el) {
  var row = this;
  var country = row.dataset.country;
  setRegion(country);
  window.close();
}

document.addEventListener('DOMContentLoaded', function() {
  var rows = document.getElementsByTagName("tr");
  for(var i = 0; i < rows.length; i++)
  {
    rows[i].addEventListener('click', clickHandler.bind(rows[i]), false);
  }
});
