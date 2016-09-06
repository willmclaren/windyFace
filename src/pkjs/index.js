
// PebbleKit JS (pkjs)

var myAPIKey = 'cc4dc7b4a43115e5e47365ed84cc9141';

Pebble.on('message', function(event) {
  // Get the message that was passed
  var message = event.data;

  if (message.fetch) {
    navigator.geolocation.getCurrentPosition(function(pos) {
      var url = 'https://api.forecast.io/forecast/' +
        myAPIKey +
        '/' + pos.coords.latitude +
        ',' + pos.coords.longitude;

      request(url, 'GET', function(respText) {
        var weatherData = JSON.parse(respText);
        
        var bearings = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
        var current = weatherData.currently;

        Pebble.postMessage({
          'weather': {
            'celcius': Math.round((current.temperature  - 32) / 1.8, -1),
            'fahrenheit': Math.round(current.temperature, -1),
            'summary': current.summary,
            'windSpeed': Math.round(current.windSpeed),
            'windBearing' : bearings[Math.round((current.windBearing / 360) * 16)],
          }
        });
      });
    }, function(err) {
      console.error('Error getting location');
    },
    { timeout: 15000, maximumAge: 60000 });
  }
});

function request(url, type, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    callback(this.responseText);
  };
  xhr.open(type, url);
  xhr.send();
}