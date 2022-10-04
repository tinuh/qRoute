function greedyAlgorithm(graph, n, maxGap){

    let paths = []
    let distances = []
    let nextDistance = []
    let nextNode = []
    let openNodes = {}
    for (let i = 0; i <  graph.length; i++){
        openNodes[i] = True
    }
    delete openNodes[0];
    for (let i = 0; i <  n; i++){
        paths.push([0])
        distances.push(0)
        nextNode.push(closestOpenNode(graph,0,openNodes))
        nextDistance.push(graph[0][nextNode[i]])  
    }
    let node = 0
    while (openNodes.length > 0){
        let minLength = -1
        for (let i = 0; i <  n; i++){
            if (minLength === -1 || paths[i].length < minLength){
                minLength = len(paths[i])
            }
        }
        let nextPathDists = {}
        for (let i = 0; i <  n; i++){
            if (paths[i].length <= minLength + maxGap){
                nextPathDists[i] = nextDistance[i]
            }
        }
        node = -1
        for (i of nextPathDists){
            if (node === -1 || nextPathDists[i] < nextPathDists[node]){
                node = i
            }
        }
        let last = paths[node][len(paths[node])-1]
        paths[node].push(nextNode[node])
        distances[node] += graph[last][nextNode[node]]
        delete openNodes[nextNode[node]]
        let dest = nextNode[node]
        for (let i = 0; i <  n; i++){
            if (nextNode[i] === dest){
                nextNode[i] = closestOpenNode(graph,paths[i][len(paths[i])-1],openNodes)
                nextDistance[i] = graph[paths[i][len(paths[i])-1]][nextNode[i]]
            }   
        }
    }
    return [paths, distances]
}