// https://github.com/radarlabs/radar-sdk-js
// https://radar.com/documentation/sdk/web

export default function createDistanceMatrix(originsArr, destinationsArr) {
	API_KEY = process.env.NEXT_PUBLIC_RADAR_API_KEY;

	var matrix = [];

	Radar.initialize(API_KEY);

	Radar.getMatrix(
		{
			origins: originsArr,
			destinations: destinationsArr,
			modes: "car",
			units: "imperial",
		},
		function (err, result) {
			if (!err) {
				// do something with result.matrix
				radarMatrix = result.matrix;
				for (let i = 0; i < radarMatrix.length; i++) {
					matrix.push([]);
					for (let j = 0; j < radarMatrix[i].length; j++) {
						matrix[matrix.length - 1].push(radarMatrix[i][j].duration.value);
					}
				}
			}
		}
	);
	return matrix;
}

originsArr = [
	{
		latitude: 39.0185856,
		longitude: -77.0120635,
	},
	{
		latitude: 39.064102,
		longitude: -76.9455316,
	},
	{
		latitude: 39.0804086,
		longitude: -76.942484,
	},
	{
		latitude: 39.1112467,
		longitude: -76.9364229,
	},
];

destinationsArr = [
	{
		latitude: 39.0185856,
		longitude: -77.0120635,
	},
	{
		latitude: 39.064102,
		longitude: -76.9455316,
	},
	{
		latitude: 39.0804086,
		longitude: -76.942484,
	},
	{
		latitude: 39.1112467,
		longitude: -76.9364229,
	},
];

console.log(createDistanceMatrix(originsArr, destinationsArr));
