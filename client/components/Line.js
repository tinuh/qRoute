const Line = ({
	mapState: { width, height },
	latLngToPixel,
	coordsArray,
	style = { stroke: "rgb(255,0,0)", strokeWidth: 2 },
}) => {
	if (
		coordsArray.length != 0 &&
		coordsArray.reduce((a, b) => a.length + b) < 2
	) {
		return null;
	}

	let lines = [];

	coordsArray.forEach((coords, x) => {
		let pixel = latLngToPixel(coordsArray[x][0]);
		for (let i = 1; i < coords.length; i++) {
			let pixel2 = latLngToPixel(coordsArray[x][i]);
			lines.push(
				<line
					key={parseInt(String(x) + String(i))}
					x1={pixel[0]}
					y1={pixel[1]}
					x2={pixel2[0]}
					y2={pixel2[1]}
					style={style}
				/>
			);
			pixel = pixel2;
		}
	});

	return (
		<svg width={width} height={height} style={{ top: 0, left: 0 }}>
			{lines.map((line) => line)}
		</svg>
	);
};

export default Line;
