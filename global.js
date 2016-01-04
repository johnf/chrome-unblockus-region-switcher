function sendNotification(msg) {
  var notificationId = 'unblockus_checker';
  var options = {
    'type': 'basic',
    'iconUrl': 'icon.png',
    'title': 'UnlockUs Netflix Region Switcher',
    'message': msg
  };

  chrome.notifications.create(notificationId, options);
}


var canvas = document.createElement("canvas");
var canvasContext = canvas.getContext("2d");
var image = new Image();
image.onload = function() {
  canvas.width = image.width;
  canvas.height = image.height;
  canvasContext.drawImage(image, 0, 0, image.width, image.height);
  canvasContext.scale(19/image.width, 19/image.height);
  var imageData = canvasContext.getImageData(0, 0, 19, 19);
};
image.src = "https://www.unblock-us.com/images/icn/favicon.ico";

function setIcon(region) {
  var region_name = regionMap(region).replace(/ /, '');

  var image = new Image();
  image.onload = function() {
    canvasContext.drawImage(image, 0, 0, image.width, image.height, 0, 0, image.width/2, image.height/2);
    var imageData = canvasContext.getImageData(0, 0, 19, 19);

    chrome.browserAction.setIcon({ "imageData" : imageData });
    chrome.browserAction.setTitle({ "title" : "UnblockUs Netflix Region: " + regionMap(region) });
  };
  image.src = "https://www.unblock-us.com/images/icn/countries/" + region_name + ".png";
}

function regionMap(region) {
  var regions = {
    "US" : "USA",
    "AR" : "Argentina",
    "AU" : "Australia",
    "AT" : "Austra",
    "BE" : "Belgium",
    "BR" : "Brazil",
    "CA" : "Canada",
    "CO" : "Columbia",
    "DK" : "Denmark",
    "FI" : "Finland",
    "FR" : "France",
    "DE" : "Germany",
    "IE" : "Ireland",
    "IT" : "Italy",
    "JP" : "Japan",
    "LU" : "Luxembourg",
    "MX" : "Mexico",
    "NL" : "Netherlands",
    "NZ" : "New Zealand",
    "NO" : "Norway",
    "PT" : "Portugal",
    "ES" : "Spain",
    "SE" : "Sweden",
    "CH" : "Switzerland",
    "UK" : "UK"
  };

  return regions[region] || region;
}

function checkRegion() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://check.unblock-us.com/get-status.js", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      var json = xhr.responseText;
      json = json.replace(/^json\((.*)\);$/, '$1');
      var resp = JSON.parse(json);

      updateMeta(resp);
    }
  };
  xhr.send();
}

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (var key in changes) {
    var storageChange = changes[key];

    if (key === 'region') {
      regionChanged(storageChange.oldValue, storageChange.newValue);
    }
  }
});

function updateMeta(data) {
  if (data.email === '') {
    sendNotification('Please log in to UnblockUs at http://unblock-us.com');
    return;
  }

  chrome.storage.local.set({ "region" : data.current });
}

function setRegion(region) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://realcheck.unblock-us.com/set-country.php?code=" + region, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      checkRegion();
    }
  };
  xhr.send();
}

function regionChanged(oldRegion, newRegion) {
  sendNotification('Region has changed from ' + regionMap(oldRegion) + ' to ' + regionMap(newRegion));
  setIcon(newRegion);
}

chrome.storage.local.get('region', function(items) {
  setIcon(items.region);
});
