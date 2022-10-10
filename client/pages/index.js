import React, { useState } from "react";
import { Map, Marker, Overlay } from "pigeon-maps";
import axios from "axios";
//import { stamenToner } from 'pigeon-maps/providers'
import { greedyAlgorithm } from "../utils/greedyAlg";
import Line from "../components/Line";

export default function Home() {
	const [address, setAddress] = useState("");
	const [drop, setDrop] = useState(false);
	const [dropSelection, setDropSelection] = useState("");
	const [loading, setLoading] = useState(false);
	const [stops, setStops] = useState([
		{
			address: "Montgomery Blair HS",
			coords: [39.018, -77.012],
		},
	]);
	const [lines, setLines] = useState([]);

	const updateAddress = (e) => {
		setAddress(e.target.value);
	};

	const add = async () => {
		if (address === null) return false;
		await setLoading(true);
		const axios = require("axios");
		const params = await {
			access_key: process.env.NEXT_PUBLIC_POSITION_API_KEY,
			query: address,
		};

		await axios
			.get("http://api.positionstack.com/v1/forward", { params })
			.then((res) => {
				console.log(res.data);
				let temp = stops;
				temp.push({
					address: address,
					coords: [res.data.data[0].latitude, res.data.data[0].longitude],
				});
				setStops(temp);
				// let temp = paths;
				// temp[0].anchors.push({
				// 	address: address,
				// 	coords: [res.data.data[0].latitude, res.data.data[0].longitude],
				// });
				// setPaths(temp);
				setAddress("");
			})
			.catch((error) => {
				console.log(error);
				alert("Error: " + error);
			});
	};

	const doIt = () => {
		let temp = stops.map(({ coords }) => {
			return coords;
		});
		let res = greedyAlgorithm(temp, 2, 0);
		console.log(res);
		let linesTemp = [];
		res[0].forEach((path) => {
			path.slice(0, -1).forEach((line, i) => {
				linesTemp.push([stops[path[i]].coords, stops[path[i + 1]].coords]);
				//return [stops[path[i]].coords, stops[path[i + 1]].coords];
			});
		});
		console.log(linesTemp);
		setLines(linesTemp);
	};

	return (
		<div className="text-center mx-20">
			<img
				className="absolute z-50 w-16"
				src="https://i.gifer.com/origin/5a/5ab33aabd7ff03f9bf4678b91a07afac_w200.gif"
			/>
			<img className="h-20 mt-5 m-auto" src="/logo.svg" alt="qroute logo" />

			<div className="my-5 inline-flex gap-4 w-full">
				<div className="flex-2 inline-flex items-stretch bg-white border-2 border-black rounded-md dark:bg-gray-900 dark:border-gray-800">
					<a className="m-auto px-4 py-2 text-sm text-black dark:text-gray-300 dark:hover:text-gray-200 dark:hover:bg-gray-800 hover:text-gray-700 hover:bg-gray-50 rounded-l-md">
						{dropSelection || "Route ID"}
					</a>

					<div className="relative">
						<button
							type="button"
							onClick={() => setDrop(!drop)}
							onBlur={() => setDrop(false)}
							className="inline-flex items-center justify-center h-full px-2 text-black border-l-2 border-black dark:text-gray-300 dark:border-gray-700 dark:hover:text-gray-200 dark:hover:bg-gray-800 hover:text-gray-700 rounded-r-md hover:bg-gray-50"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="w-4 h-4"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
									clipRule="evenodd"
								/>
							</svg>
						</button>

						{drop && (
							<div
								className="absolute right-0 z-10 w-28 mt-4 bg-white border border-gray-100 shadow-lg origin-top-right dark:bg-gray-900 dark:border-gray-800 rounded-md"
								role="menu"
							>
								<div className="p-2">
									{paths.map((path, index) => (
										<a
											key={index}
											onClick={() => setDropSelection(path.route)}
											href="/edit"
											className="block px-4 py-2 text-sm text-black rounded-lg hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800"
											role="menuitem"
										>
											{path.route}
										</a>
									))}
								</div>
							</div>
						)}
					</div>
				</div>

				<div className="flex-1 relative">
					<label className="sr-only" htmlFor="name">
						Address
					</label>
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
						className="absolute p-2 text-white bg-black rounded-full -translate-y-1/2 top-1/2 right-4"
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
				<a
					className="group relative inline-flex items-center overflow-hidden rounded px-8 py-3 focus:outline-none focus:ring active:bg-yellow-600"
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

			{/* {paths.map(({ anchors, route }) => (
				<div className="text-left" key={route}>
					<p className="font-bold">{route}</p>
					<ul className="text-left">
						{anchors.map((point, key) => (
							<li key={key}>{point.address}</li>
						))}
					</ul>
				</div>
			))} */}

			<div className="text-left">
				<ul className="text-left">
					{stops.map(({ address, coords }, i) => (
						<li key={i}>{address}</li>
					))}
				</ul>
			</div>

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

					{lines.map((line, i) => (
						<Line key={i} coordsArray={[...line]} />
					))}
				</Map>
			</div>
		</div>
	);
}
