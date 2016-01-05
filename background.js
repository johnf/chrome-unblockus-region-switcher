chrome.storage.local.get('region', function(items) {
  setIcon(items.region);
});

addStorageListener();
createAlarm();
