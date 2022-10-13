function closestOpenNode(graph, n, openNodes) {
	let c = -1;
	Object.keys(openNodes).forEach((i) => {
		if ((graph[n][i] < graph[n][c] || c === -1) && i != n) {
			c = i;
		}
	});
	return c;
}

function firstMinIndex(arr) {
	let index = -1;
	for (let i = 0; i < arr.length; i++) {
		if (index == -1 || arr[i] < arr[index]) {
			index = i;
		}
	}
	return index;
}

function greedyAlgorithmCartesian(coordinates, n, maxGap) {
	console.log(n, maxGap);
	let graph = [];
	for (let i = 0; i < coordinates.length; i++) {
		graph.push([]);
		for (let x = 0; x < coordinates.length; x++) {
			graph[i].push(
				(coordinates[i][0] - coordinates[x][0]) ** 2 +
					(coordinates[i][1] - coordinates[x][1]) ** 2
			);
		}
	}
	let paths = [];
	let distances = [];
	let nextDistance = [];
	let nextNode = [];
	let openNodes = {};
	for (let i = 0; i < graph.length; i++) {
		openNodes[i] = true;
	}
	delete openNodes[0];
	for (let i = 0; i < n; i++) {
		paths.push([0]);
		distances.push(0);
		nextNode.push(closestOpenNode(graph, 0, openNodes));
		nextDistance.push(graph[0][nextNode[i]]);
	}
	let node = 0;
	//console.log(openNodes);
	while (Object.keys(openNodes).length > 0) {
		//console.log("hi");
		let minLength = -1;
		for (let i = 0; i < n; i++) {
			if (minLength === -1 || paths[i].length < minLength) {
				minLength = paths[i].length;
			}
		}
		let nextPathDists = {};
		console.log("minLength:", minLength);
		for (let i = 0; i < n; i++) {
			if (paths[i].length <= minLength + maxGap) {
				console.log("adding:", i, " length: ",paths[i].length, " threshold: ",minLength + maxGap,"gap: ",maxGap);
				nextPathDists[i] = nextDistance[i];
			}
		}
		node = -1;
		Object.keys(nextPathDists).forEach((i) => {
			console.log(i, nextPathDists[i]);
			if (node === -1 || nextPathDists[i] < nextPathDists[node]) {
				node = i;
			}
		});
		let last = paths[node][paths[node].length - 1];
		paths[node].push(nextNode[node]);
		distances[node] += graph[last][nextNode[node]];
		delete openNodes[nextNode[node]];
		let dest = nextNode[node];
		for (let i = 0; i < n; i++) {
			if (nextNode[i] === dest) {
				nextNode[i] = closestOpenNode(
					graph,
					paths[i][paths[i].length - 1],
					openNodes
				);
				console.log(nextNode[i]);
				nextDistance[i] = graph[paths[i][paths[i].length - 1]][nextNode[i]];
			}
		}
	}
	return [paths, distances];
}

function greedyAlgorithm(graph, n, maxGap) {
	let paths = [];
	let distances = [];
	let nextDistance = [];
	let nextNode = [];
	let openNodes = {};
	for (let i = 0; i < graph.length; i++) {
		openNodes[i] = true;
	}
	delete openNodes[0];
	for (let i = 0; i < n; i++) {
		paths.push([0]);
		distances.push(0);
		nextNode.push(closestOpenNode(graph, 0, openNodes));
		nextDistance.push(graph[0][nextNode[i]]);
	}
	let node = 0;
	console.log(openNodes);
	while (Object.keys(openNodes).length > 0) {
		console.log("hi");
		let minLength = -1;
		for (let i = 0; i < n; i++) {
			if (minLength === -1 || paths[i].length < minLength) {
				minLength = paths[i].length;
			}
		}
		let nextPathDists = {};
		for (let i = 0; i < n; i++) {
			if (paths[i].length <= minLength + maxGap) {
				nextPathDists[i] = nextDistance[i];
			}
		}
		node = -1;
		Object.keys(nextPathDists).forEach((i) => {
			if (node === -1 || nextPathDists[i] < nextPathDists[node]) {
				node = i;
			}
		});
		let last = paths[node][paths[node].length - 1];
		paths[node].push(nextNode[node]);
		distances[node] += graph[last][nextNode[node]];
		delete openNodes[nextNode[node]];
		let dest = nextNode[node];
		for (let i = 0; i < n; i++) {
			if (nextNode[i] === dest) {
				nextNode[i] = closestOpenNode(
					graph,
					paths[i][paths[i].length - 1],
					openNodes
				);
				console.log(nextNode[i]);
				nextDistance[i] = graph[paths[i][paths[i].length - 1]][nextNode[i]];
			}
		}
	}
	return [paths, distances];
}

export { greedyAlgorithmCartesian, greedyAlgorithm };
