import requests
import json

def closestOpenNode(graph,n,openNodes):
    """
    takes in a graph, starting node, and visited dictionary and finds the closest avalible node to n
    graph: weighted graph
    n: root node
    openNodes: dictionary of open nodes
    """
    c = -1
    for i in openNodes:
        if (graph[n][i] < graph[n][c] or c == -1) and i != n:
            c = i
    return c

def greedyFlexibleTurnPriority(graph,n,maxGap):
    """
    simple greedy algorithm that updates the path with the shortest best next move as well as the fewest nodes within a range in the path and recalculates the best next moves
    graph: weighted graph
    n: number of paths to take
    maxGap: amount bigger one path is allowed to go from another
    """
    paths = []
    distances = []
    nextDistance = []
    nextNode = []
    openNodes = {}
    for i in range(len(graph)):
        openNodes[i] = True
    del openNodes[0]
    for i in range(n):
        paths.append([0])
        distances.append(0)
        nextNode.append(closestOpenNode(graph,0,openNodes))
        nextDistance.append(graph[0][nextNode[i]])  
    node = 0
    while len(openNodes) > 0:
        minLength = -1
        for i in range(n):
            if minLength == -1 or len(paths[i]) < minLength:
                minLength = len(paths[i])
        nextPathDists = {}
        for i in range(n):
            if len(paths[i]) <= minLength + maxGap:
                nextPathDists[i] = nextDistance[i]
        node = -1
        for i in nextPathDists:
            if node == -1 or nextPathDists[i] < nextPathDists[node]:
                node = i
        last = paths[node][len(paths[node])-1]
        paths[node].append(nextNode[node])
        distances[node] += graph[last][nextNode[node]]
        del openNodes[nextNode[node]]
        dest = nextNode[node]
        for i in range(n):
            if nextNode[i] == dest:
                nextNode[i] = closestOpenNode(graph,paths[i][len(paths[i])-1],openNodes)
                nextDistance[i] = graph[paths[i][len(paths[i])-1]][nextNode[i]]
    return paths, distances


def convertAddressesToCoordinates(addresses):
	BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json'
	
	coordinates = ''
	
	for address in addresses: 
		url = BASE_URL + '?address=' + address + '&key=' + API_KEY
		
		response = requests.request("GET", url)
		
		results = response.json()['results'][0]
		lat = results['geometry']['location']['lat']
		lng = results['geometry']['location']['lng']
		
		coordinates += str(lat) + ',' + str(lng) + '%7C'
	
	return coordinates

def createDistanceMatrix(coordinates): 
	BASE_URL_Route = 'https://maps.googleapis.com/maps/api/distancematrix/json?' 
	
	RouteURL = BASE_URL_Route + 'origins=' + coordinates + '&destinations=' + coordinates + 'mode=driving&key=' + API_KEY 
	
	payload={}
	headers = {}
	
	response = requests.request("GET", RouteURL, headers=headers, data=payload)
	results = response.json()

	rows = results['rows']

	matrix = []
	for row in rows:
		matrixRow = []
		for e in range(len(row["elements"])-1):
			matrixRow.append(row["elements"][e]["duration"]["value"])
		matrix.append(matrixRow)
	
	return(matrix)


addresses = ['Montgomery Blair HS','GALWAY ES', 'GREENCASTLE ES', 'BURTONSVILLE ES']

coordinatesOfLocations = convertAddressesToCoordinates(addresses)

matrix = createDistanceMatrix(coordinatesOfLocations)

print(matrix)

p, d = greedyFlexibleTurnPriority(matrix, 2, 0)

print(p)

