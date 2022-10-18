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
	maxGap = parseInt(maxGap)
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
		for (let i = 0; i < n; i++) {
			if (paths[i].length <= minLength + maxGap) {
				console.log(
					"adding:",
					i,
					" length: ",
					paths[i].length,
					" threshold: ",
					minLength + maxGap,
					"gap: ",
					maxGap
				);
				nextPathDists[i] = nextDistance[i];
			}
		}
		let node = -1;
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
	maxGap = parseInt(maxGap)
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
		let node = -1;
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
	console.log("out greed")
	console.log(paths)
	return [paths, distances];
}



function deepCopy(arr){
	const clone = (items) => items.map(item => Array.isArray(item) ? clone(item) : item);
	return clone(arr)
	//credit: Tareq Al-Zubaidi
}

function updateRoutes(graph,n,maxGap,paths,distances,openNodes,results){
	console.log("recurse")
	maxGap = parseInt(maxGap)
	let nextNode = Array(n).fill(0)
	let nextDistance = Array(n).fill(0)

	for (let i = 0; i < n; i++){
		nextNode[i] = closestOpenNode(graph,paths[i][paths[i].length-1],openNodes)
		console.log(i,paths[i],nextNode[i],openNodes)
		nextDistance[i] = graph[paths[i][paths[i].length-1]][nextNode[i]]
	}

	if (Object.keys(openNodes).length > 0){
		let minLength = -1

		for (let i = 0; i < n; i++){
			if (minLength == -1 || paths[i].length < minLength){
				minLength = paths[i].length
			}
		}
		for (let i = 0; i < n; i++){
			if(paths[i].length <= minLength + maxGap){
				/*
				let routes = deepCopy(paths)
				let dists = deepCopy(distances)
				let last = paths[i][paths[i].length-1]
				routes[i].push(nextNode[i])
				dists[i] += graph[last][nextNode[i]]
				let oNodes = Object.assign({}, openNodes);
				delete oNodes[nextNode[i]];
				let r = updateRoutes(graph,n,maxGap,routes,dists,Object.assign({}, oNodes),results)
				//I don't need to do the below in the python. Checking oNides for length 0 doesn't work for some reason
				//likely has to do with copying object, but it should just work?
				if ((Object.keys(openNodes).length == 1)){
					results.push([r[0],r[1]])
				}
				*/
				Object.keys(openNodes).forEach((j) => {
					let routes = deepCopy(paths)
				let dists = deepCopy(distances)
				let last = paths[i][paths[i].length-1]
				routes[i].push(j)
				dists[i] += graph[last][j]
				let oNodes = Object.assign({}, openNodes);
				delete oNodes[j];
				console.log("j")
				console.log(j)
				let r = updateRoutes(graph,n,maxGap,routes,dists,Object.assign({}, oNodes),results)
				//I don't need to do the below in the python. Checking oNides for length 0 doesn't work for some reason
				//likely has to do with copying object, but it should just work?
				if ((Object.keys(oNodes).length == 0)){
					results.push([r[0],r[1]])
				}
			});
			}
		}
	}
	return [paths,distances,results]
}

function recursiveAlgorithm(graph,n,maxGap){
	let paths = []
	let distances = []
	let openNodes = {}
	let results = []
	for(let i = 0; i < graph.length;i++){
		openNodes[i] = true
	}
	delete openNodes[0];
	for(let i = 0; i < n; i++){
		paths.push([0])
		distances.push(0)
	}
	let output = updateRoutes(graph,n,maxGap,paths,distances,openNodes,results)
	let r = output[2]
	let minDist = -1
	let minRouteNum = -1
	for(let i = 0; i < r.length;i++){
		console.log("route")
		console.log(r[i][0],r[i][1].reduce((partialSum, a) => partialSum + a, 0))
		if(minRouteNum == -1 || r[i][1].reduce((partialSum, a) => partialSum + a, 0) < minDist){
			minDist = r[i][1].reduce((partialSum, a) => partialSum + a, 0)
			minRouteNum = i
		}
	}
	console.log("out rec")
	console.log(r[minRouteNum][0])
	return [r[minRouteNum][0],r[minRouteNum][1]]
}



export { greedyAlgorithmCartesian, greedyAlgorithm, recursiveAlgorithm };
