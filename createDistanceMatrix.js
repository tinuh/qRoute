// https://github.com/radarlabs/radar-sdk-js
// https://radar.com/documentation/sdk/web

API_KEY = "prj_test_pk_782c752373db12dbd94e9a8de91a108f249a6ab6"

Radar.initialize(API_KEY);

originsArr = [{
    latitude: 39.0185856,
    longitude: -77.0120635
  },
  {
    latitude: 39.064102,
    longitude:-76.9455316
  },
  {
    latitude: 39.0804086,
    longitude:-76.942484
  },
  {
    latitude:39.1112467,
    longitude:-76.9364229
  }];

destinationsArr = [{
    latitude: 39.0185856,
    longitude: -77.0120635
  },
  {
    latitude: 39.064102,
    longitude:-76.9455316
  },
  {
    latitude: 39.0804086,
    longitude:-76.942484
  },
  {
    latitude:39.1112467,
    longitude:-76.9364229
  }];

Radar.getMatrix({
  origins: originsArr,
  destinations: destinationsArr,
  modes: 'car',
  units: 'imperial'
}, function(err, result) {
  if (!err) {
    // do something with result.matrix
	radarMatrix = result.matrix;
	var matrix = [];
	
	for (let i=0; i < radarMatrix.length; i++) {
	   matrix.push([]);
    	for (let j=0; j < radarMatrix[i].length; j++) {
			matrix[matrix.length - 1].push(radarMatrix[i][j].duration.value);
	  	}
	}
	console.log(matrix);
	  
  }
});
