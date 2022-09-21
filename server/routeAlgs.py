import random
import math



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


def displayPaths(p,d):
    for i in range(len(p)):
        print("path: " + str(i) + " length: " + str(len(p[i])) + " distance: " + str(d[i]))
    print(" ")

bestCount = [0,0,0,0,0,0,0,0]
for i in range(1):
    t = makeTestGraph(1000,1,100)

    #p,d = greedyTurn(t,5)
    #p2,d2 = greedyNeedy(t,5)
    #p3,d3 = greedyNeedyChain(t,5,10)
    p4,d4 = greedyPriority(t,10)
    p5,d5 = greedyTurnPriority(t,10)
    p6,d6 = greedyFlexibleTurnPriority(t,10,5)
    #p7,d7 = greedyFlexibleTurnPriority(t,10,9)
    #p8,d8 = greedyFlexibleTurnPriority(t,10,15)
    #p9,d9 = greedyFlexibleTurnPriority(t,10,20)

    #displayPaths(p,d)
    #displayPaths(p2,d2)
    #displayPaths(p3,d3)
    displayPaths(p4,d4)
    displayPaths(p5,d5)
    displayPaths(p6,d6)

    #dists = [sum(d),sum(d2),sum(d3),sum(d4),sum(d5),sum(d6),sum(d7),sum(d8)]
    dists = [sum(d4),sum(d5),sum(d6)]
    #print(firstMinIndex(dists),dists)
    #print(min(dists))
    bestCount[firstMinIndex(dists)] += 1
print(bestCount)
    #print(d)
    
