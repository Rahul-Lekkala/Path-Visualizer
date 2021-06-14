// // Performs Astar algorithm; returns *all* nodes in the order
// // in which they were visited. Also makes nodes point back to their
// // previous node, effectively allowing us to compute the shortest path
// // by backtracking from the finish node.

// /*
// Best First Search Algorithm
// 1. Initially, all the vertices are at distance Infinity
// 2. Update the start node distance to 0
// 3. Update current node to start node
// 4. Update the neighbours of the current node that are unvisited with the distance
// 5. Pick the node having shortest hueristic distance node from neighbours.
// 6. Update current node to the shortest distance node
// 7. Repeat steps 4 to 7 until current node is target node

// Implementation
// 1. Initially, all the vertices are at distance Infinity
// 2. Update the start node distance to 0
// 3. Sort all unvisited nodes based on the distance
// 4. Pick the shortest distance node from unvisited nodes which is zeroth index node(which is start node,
//     since its the only one with distance 0)
// 5. Update current node to this node(shortest distance node)
// 6. Update the neighbours of the current node that are unvisited with the distance
// 7. Repeat steps 3 to 6 until current node is target node(Found) or current node is infinity(Not Found)

// */

export function bestFirstSearch(grid, startNode, targetNode) {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    startNode.heuristicDistance = 0;
    const unvisitedNodes = getAllNodes(grid, startNode, targetNode);

    while (!!unvisitedNodes.length) {
        sortNodesByHeuristicDistance(unvisitedNodes);
        //Pop the zeroth index node which will be the closest node from current node
        const closestNode = unvisitedNodes.shift();

        // If we encounter a wall, we skip it.
        if (closestNode.isWall) continue;

        //   console.log(
        //       closestNode.row +
        //           " " +
        //           closestNode.col +
        //           " " +
        //           closestNode.heuristicDistance
        //   );
        // If the closest node is at a distance of infinity,
        // we must be trapped and should therefore stop.
        if (closestNode.heuristicDistance === Infinity)
            return visitedNodesInOrder;
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);

        //If the closestNode is the target, then we found the path, return
        if (closestNode === targetNode) return visitedNodesInOrder;

        updateUnvisitedNeighbors(closestNode, grid, targetNode);
    }
}

function sortNodesByHeuristicDistance(unvisitedNodes) {
    unvisitedNodes.sort(
        (nodeA, nodeB) => nodeA.heuristicDistance - nodeB.heuristicDistance
    );
}

function updateUnvisitedNeighbors(node, grid, targetNode) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    //let distanceToCompare = node.distance + targetNode.weight + distance[0];
    for (const neighbor of unvisitedNeighbors) {
        //neighbor.distance = node.distance + 1;
        neighbor.heuristicDistance = manhattanDistance(neighbor, targetNode);
        neighbor.previousNode = node;
        //console.log(neighbor.row, neighbor.col, neighbor.heuristicDistance);
    }
}

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter((neighbor) => !neighbor.isVisited);
}

function getAllNodes(grid, targetNode) {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}

// Backtracks from the targetNode to find the shortest path.
// Only works when called *after* the bestFirstSearch method above.
export function getNodesInShortestPathBestFirstSearch(targetNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = targetNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}

function manhattanDistance(neighbor, targetNode) {
    return (
        Math.abs(targetNode.row - neighbor.row) +
        Math.abs(targetNode.col - neighbor.col)
    );
}
