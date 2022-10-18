from networkx import DiGraph
from vrpy import VehicleRoutingProblem
import random
import math
import copy



def makeTestGraph(n,m,M):
    """
    creates a connected weighted graph of size n with floats between min and max

    n: number of nodes in the graph
    m: minimum weight between two nodes
    M: maximum weight between two nodes
    """
    g = []
    for i in range(n):
        g.append([])
        for j in range(n):
            g[i].append(0)
    for i in range(n):
        for j in range(n):
            g[i][j] = 0
    for i in range(n):
        for j in range(i,n): #this assignment is broken atm
            if i != j:
                dist = m + random.random()*(M-m)
                g[i][j] = dist
                g[j][i] = dist
    return g

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

def firstMinIndex(arr):
    """
    returns the index of the first instance of the lowest value

    arr: number array
    """
    index = -1
    for i in range(len(arr)):
        if index == -1 or arr[i] < arr[index]:
            index = i
    return index

def greedyTurn(graph, n):
    """
    simple greedy algorithm that takes turns selecting the nearest unselected node

    graph: weighted graph
    n: number of paths to take
    """
    paths = []
    distances = []
    for i in range(n):
        paths.append([0])
        distances.append(0)
    openNodes = {}
    for i in range(len(graph)):
        openNodes[i] = True
    del openNodes[0]
    node = 0
    while len(openNodes) > 0:
        last = paths[node][len(paths[node])-1]
        dest = closestOpenNode(graph,last,openNodes)
        paths[node].append(dest)
        distances[node] += graph[last][dest]
        del openNodes[dest]
        node = (node + 1)%len(paths)
    return paths, distances

def greedyChain(graph,n,chainThreshold):
    """
    simple greedy algorithm that takes turns selecting the nearest unselected node
    If nearest node after a move is below the chain threshold, the path will automatically chain to it

    graph: weighted graph
    n: number of paths to take
    chainThreshold: how close a node must be to be chained
    """
    paths = []
    distances = []
    for i in range(n):
        paths.append([0])
        distances.append(0)
    openNodes = {}
    for i in range(len(graph)):
        openNodes[i] = True
    del openNodes[0]
    node = 0
    while len(openNodes) > 0:
        last = paths[node][len(paths[node])-1]
        dest = closestOpenNode(graph,last,openNodes)
        paths[node].append(dest)
        distances[node] += graph[last][dest]
        del openNodes[dest]
        if graph[dest][closestOpenNode(graph,dest,openNodes)] < chainThreshold:
            print("chain: " + str(node) + ": " + str(paths[node]))
            print(graph[dest][closestOpenNode(graph,dest,openNodes)])
        else:
            node = (node + 1)%len(paths)
    return paths, distances

def greedyNeedy(graph, n):
    """
    simple greedy algorithm that selects the nearest unselected node of the shortest distance

    graph: weighted graph
    n: number of paths to take
    """
    paths = []
    distances = []
    for i in range(n):
        paths.append([0])
        distances.append(0)
    openNodes = {}
    for i in range(len(graph)):
        openNodes[i] = True
    del openNodes[0]
    node = 0
    while len(openNodes) > 0:
        last = paths[node][len(paths[node])-1]
        dest = closestOpenNode(graph,last,openNodes)
        paths[node].append(dest)
        distances[node] += graph[last][dest]
        del openNodes[dest]
        node = firstMinIndex(distances)
    return paths, distances

def greedyNeedyChain(graph, n, chainThreshold):
    """
    simple greedy algorithm that selects the nearest unselected node of the shortest distance
    If nearest node after a move is below the chain threshold, the path will automatically chain to it

    graph: weighted graph
    n: number of paths to take
    chainThreshold: how close a node must be to be chained
    """
    paths = []
    distances = []
    for i in range(n):
        paths.append([0])
        distances.append(0)
    openNodes = {}
    for i in range(len(graph)):
        openNodes[i] = True
    del openNodes[0]
    node = 0
    while len(openNodes) > 0:
        last = paths[node][len(paths[node])-1]
        dest = closestOpenNode(graph,last,openNodes)
        paths[node].append(dest)
        distances[node] += graph[last][dest]
        del openNodes[dest]
        if graph[dest][closestOpenNode(graph,dest,openNodes)] < chainThreshold:
            pass
        else:
            node = firstMinIndex(distances)
    return paths, distances

def greedyPriority(graph,n):
    """
    simple greedy algorithm that updates the path with the shortest best next move and recalculates the best next moves

    graph: weighted graph
    n: number of paths to take
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
        #print(nextDistance)
        #print(nextNode)
        #print(paths)
        node = firstMinIndex(nextDistance)
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

def greedyTurnPriority(graph,n):
    """
    simple greedy algorithm that updates the path with the shortest best next move as well as the fewest nodes in the path and recalculates the best next moves

    graph: weighted graph
    n: number of paths to take
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
            if len(paths[i]) == minLength:
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

def vrpyRouteV1(graph,n,maxGap = 0):
    """
    Uses vrpy routing problem algorithm to find the lowest distance route with n routes and a maximum stop gap between routes of maxGap

    graph: weighted graph
    n: number of paths to take
    maxGap: amount bigger one path is allowed to go from another
    """
    G = DiGraph()
    for i in range(1,len(graph)):
        G.add_edge("Source", i, cost=graph[i][0])
        for j in range(1, len(graph[i])):
            G.add_edge(i, j, cost=graph[i][j])       
        G.add_edge(i, "Sink", cost=0)
    prob = VehicleRoutingProblem(G)
    prob.num_vehicles = n
    prob.num_stops = math.ceil(len(graph)/n) + int(maxGap/2)
    prob.solve(greedy = True)
    return prob.best_routes,prob.best_value

global itr
itr = 0

def updateRoutes(graph,n,maxGap,paths,distances,openNodes,results):
    global itr
    itr += 1
    print(itr,len(openNodes),openNodes)
    nextNode = [0] * n
    nextDistance = [0] * n
    for i in range(n):
        nextNode[i] = closestOpenNode(graph,paths[i][len(paths[i])-1],openNodes)
        nextDistance[i] = graph[paths[i][len(paths[i])-1]][nextNode[i]]

    if len(openNodes) > 0:
        minLength = -1

        for i in range(n):
            if minLength == -1 or len(paths[i]) < minLength:
                minLength = len(paths[i])
        #nextPathDists = {}
        for i in range(n):
            if len(paths[i]) <= minLength + maxGap:
                #nextPathDists[i] = nextDistance[i]
                routes = copy.deepcopy(paths)
                dists = copy.deepcopy(distances)
                last = paths[i][len(paths[i])-1]
                routes[i].append(nextNode[i])
                dists[i] += graph[last][nextNode[i]]
                oNodes = openNodes.copy()
                del oNodes[nextNode[i]]
                print(oNodes,openNodes)
                r = updateRoutes(graph,n,maxGap,routes,dists,oNodes,results)
                print(oNodes,openNodes)
                if len(oNodes) == 0:
                    results.append([r[0],r[1]])
            
    return [paths, distances,results]

def recursiveFlexibleTurnPriority(graph,n,maxGap):
    paths = []
    distances = []
    openNodes = {}
    results = []
    for i in range(len(graph)):
        openNodes[i] = True
    del openNodes[0]
    for i in range(n):
        paths.append([0])
        distances.append(0)
    output = updateRoutes(graph,n,maxGap,paths,distances,openNodes,results)
    r = output[2]
    #print(output)
    minDist = -1
    minRouteNum = -1
    for i in range(len(r)):
        if minRouteNum == -1 or sum(r[i][1]) < minDist:
            minDist = sum(r[i][1])
            print(sum(r[i][1]))
            minRouteNum = i
    return r[minRouteNum][0], r[minRouteNum][1]
    


def displayPaths(p,d):
    for i in range(len(p)):
        print("path: " + str(i) + " length: " + str(len(p[i])) + " distance: " + str(d[i]))
    print(" ")

bestCount = [0,0,0,0,0,0,0,0]

print(recursiveFlexibleTurnPriority([[0,1,1],[1,0,2],[1,2,0]],2,0))

for i in range(1):

    stopCount = int(input("number of stops: "))
    routeNum = int(input("number of busses: "))
    
    t = makeTestGraph(stopCount,1,100)

    #p,d = greedyTurn(t,routeNum)
    #p2,d2 = greedyNeedy(t,routeNum)
    #p3,d3 = greedyNeedyChain(t,routeNum,10)
    #p4,d4 = greedyPriority(t,routeNum)
    p5,d5 = greedyTurnPriority(t,routeNum)
    p6,d6 = greedyFlexibleTurnPriority(t,routeNum,1)
    #p7,d7 = greedyFlexibleTurnPriority(t,routeNum,9)
    #p8,d8 = greedyFlexibleTurnPriority(t,routeNum,15)
    #p9,d9 = greedyFlexibleTurnPriority(t,routeNum,20)
    p10,d10 = recursiveFlexibleTurnPriority(t,routeNum,1)

    v1,vd1 = vrpyRouteV1(t,routeNum,1) 

    #displayPaths(p,d)
    #displayPaths(p2,d2)
    #displayPaths(p3,d3)
    #displayPaths(p4,d4)
    #displayPaths(p5,d5)
    #displayPaths(p6,d6)
    print(v1)
    print(vd1)

    #dists = [sum(d),sum(d2),sum(d3),sum(d4),sum(d5),sum(d6),sum(d7),sum(d8)]
    dists = [sum(d5),sum(d6),sum(d10)]
    paths = [p5,p6,p10]
    print(firstMinIndex(dists),dists)
    print(min(dists))
    bestCount[firstMinIndex(dists)] += 1
    print(bestCount)
    print(paths[firstMinIndex(dists)])
    print(min(dists))
    #print(d)
