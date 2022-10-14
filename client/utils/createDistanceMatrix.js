// https://github.com/radarlabs/radar-sdk-js
// https://radar.com/documentation/sdk/web
import Radar from "radar-sdk-js";

export default function createDistanceMatrix(originsArr, destinationsArr) {
	let API_KEY = process.env.NEXT_PUBLIC_RADAR_API_KEY;

	let matrix = [];

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
				console.log(result.matrix);
				// do something with result.matrix
				let radarMatrix = result.matrix;
				for (let i = 0; i < radarMatrix.length; i++) {
					matrix.push([]);
					for (let j = 0; j < radarMatrix[i].length; j++) {
						matrix[i].push(radarMatrix[i][j].duration.value);
					}
				}
			}
		}
	);
	console.log(matrix.length);
	return matrix;
}

//console.log(createDistanceMatrix(originsArr, destinationsArr));
