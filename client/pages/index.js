import React, { useState } from "react";
import { Map, Marker, Overlay } from "pigeon-maps";
import axios from "axios";
import { greedyAlgorithm, greedyAlgorithmCartesian } from "../utils/greedyAlg";
import Line from "../components/Line";
import Radar from "radar-sdk-js";

export default function Home() {
	const [address, setAddress] = useState("");
	const [loading, setLoading] = useState(false);
	const [stops, setStops] = useState([
		{
			address: "Montgomery Blair HS",
			coords: [39.018, -77.012],
		},
	]);
	const [lines, setLines] = useState([]);
	const [paths, setPaths] = useState([]);
	const [numRoutes, setRoutes] = useState(2);
	const [gap, setGap] = useState(2);

	const updateAddress = (e) => {
		setAddress(e.target.value);
	};

	const add = async () => {
		if (address === null) return false;
		await setLoading(true);
		const params = await {
			access_key: process.env.NEXT_PUBLIC_POSITION_API_KEY,
			query: address,
		};

		await Radar.initialize(process.env.NEXT_PUBLIC_RADAR_API_KEY);

		await Radar.geocode({ query: address }, function (err, res) {
			if (!err) {
				// do something with result.addresses
				console.log(res);
				let temp = stops;
				temp.push({
					address: address,
					coords: [res.addresses[0].latitude, res.addresses[0].longitude],
				});
				setStops(temp);
				setAddress("");
				doIt();
			} else {
				alert(err);
			}
		});
	};

	const doIt = async () => {
		let temp = stops.map(({ coords }) => {
			return {
				latitude: coords[0],
				longitude: coords[1],
			};
		});

		let matrix = [];
		await Radar.initialize(process.env.NEXT_PUBLIC_RADAR_API_KEY);
		await Radar.getMatrix(
			{
				origins: temp,
				destinations: temp,
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

				console.log(matrix);
				let res = greedyAlgorithm(matrix, numRoutes, gap);
				console.log(res);

				let linesTemp = [];
				let pathsTemp = [];
				res[0].forEach((path, i) => {
					linesTemp.push([]);
					pathsTemp.push([]);
					path.forEach((line) => {
						linesTemp[i].push(stops[parseInt(line)].coords);
						pathsTemp[i].push(stops[parseInt(line)].address);
					});
				});
				console.log(linesTemp);
				setLines(linesTemp);
				setPaths(pathsTemp);
			}
		);
	};

	const removeStop = (index) => {
		let temp = stops;
		temp.splice(index, 1);
		setStops(temp);
		doIt();
	};
	return (
		<div className="text-center mx-20">
			<img className="absolute z-50 w-16" src="/bee.gif" />
			<img className="h-20 mt-5 m-auto" src="/logo.svg" alt="qroute logo" />

			<div className="my-5 inline-flex gap-4 w-full">
				<div className="flex-1 text-left relative">
					<label className="block text-xs font-medium">Address</label>
					<input
						value={address || ""}
						onChange={updateAddress}
						className="w-full py-4 pl-3 pr-16 text-sm border-2 border-black rounded-lg"
						placeholder="Address"
						type="text"
						id="address"
						onSubmit={add}
					/>

					<button
						className="absolute p-2 text-white bg-black rounded-full -translate-y-1/4 top-1/2 right-4"
						type="button"
						onClick={add}
					>
						<svg
							className="w-4 h-4"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"
							/>
						</svg>
					</button>
				</div>
				<div className="text-left">
					<label className="block text-xs font-medium"># of Routes</label>
					<input
						type="text"
						placeholder="# of routes"
						value={numRoutes}
						onChange={(e) => setRoutes(e.target.value)}
						className="pl-3 py-4 w-28 rounded-md border-black border-2 shadow-sm sm:text-sm"
					/>
				</div>
				<div className="text-left">
					<label className="block text-xs font-medium">Gap</label>
					<input
						type="text"
						placeholder="Gap"
						value={gap}
						onChange={(e) => setGap(e.target.value)}
						className="pl-3 py-4 w-16 rounded-md border-black border-2 shadow-sm sm:text-sm"
					/>
				</div>
				<a
					className="group mt-4 relative inline-flex items-center overflow-hidden rounded px-8 py-3 focus:outline-none focus:ring active:bg-yellow-600"
					onClick={() => doIt()}
					href="#"
					style={{ backgroundColor: "#ffde59" }}
				>
					<span className="absolute left-0 -translate-x-full transition-transform group-hover:translate-x-4">
						<svg
							className="h-5 w-5"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17 8l4 4m0 0l-4 4m4-4H3"
							/>
						</svg>
					</span>

					<span className="text-sm font-medium transition-all group-hover:ml-4">
						Do it
					</span>
				</a>
			</div>

			<div className="flex gap-5">
				{paths.map((path, i) => (
					<a
						key={i}
						className="relative block rounded-xl border-2 border-black p-5 shadow-xl"
					>
						<div className="text-gray-500 text-left sm:pr-8">
							<h5 className=" text-xl font-bold text-gray-900">
								Route {i + 1}
							</h5>
							<ol>
								{path.map((stop, x) => (
									<li
										key={x}
										className="hover:line-through hover:cursor-pointer hover:text-red-400"
										onClick={() =>
											removeStop(stops.findIndex((s) => s.address === stop))
										}
									>
										{stop}
									</li>
								))}
							</ol>
						</div>
					</a>
				))}
			</div>

			{/* <div className="text-left">
				<ul className="text-left">
					{stops.map(({ address, coords }, i) => (
						<li key={i}>{address}</li>
					))}
				</ul>
			</div> */}

			<div className="mt-5">
				<Map
					className="rounded-2xl"
					height={500}
					defaultCenter={[39.018, -77.012]}
					defaultZoom={11}
				>
					{/* {paths.map(({ color, anchors }) =>
						anchors.map((point, key) => (
							<Marker
								key={key}
								width={40}
								anchor={point.coords}
								color={color}
							/>
						))
					)} */}
					{stops.map(({ address, coords }, i) => (
						<Marker
							key={i}
							width={40}
							anchor={coords}
							color={"red"}
							onClick={() => alert(address)}
						/>
					))}

					<Line coordsArray={lines} />
				</Map>
			</div>
		</div>
	);
}
