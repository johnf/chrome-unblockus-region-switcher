// Set up the alarm
function createAlarm() {
  var name = 'unblockus_checker';
  var alarmInfo = {
    'periodInMinutes': 5,
  };

  chrome.alarms.create(name, alarmInfo);
}

chrome.alarms.onAlarm.addListener( function(alarm) {
  checkRegion();
});

createAlarm();

