export function depthFirstSearch(grid, startNode, targetNode) {
    console.log("In DFS");

    const visitedNodesInOrder = [];
    //startNode.distance = 0;
    //const unvisitedNodes = getAllNodes(grid);
    //visitedNodesInOrder.push(startNode);
    const visitedNodesStack = [];
    visitedNodesStack.push(startNode);
    while (visitedNodesStack.length > 0) {
        const currentNode = visitedNodesStack.pop();
        // console.log("Length = ", visitedNodesQueue.length);
        //  console.log("currentNode " + currentNode.row + " " + currentNode.col);

        if (currentNode.isWall) continue;

        //if (currentNode.distance === Infinity) return visitedNodesInOrder;

        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode);

        //console.log(visitedNodesInOrder);

        if (currentNode === targetNode) {
            console.log("Target Found " + visitedNodesStack.length);
            console.log(visitedNodesInOrder.length);
            return visitedNodesInOrder;
        }

        const unvisitedNeighbors = updateUnvisitedNeighbors(currentNode, grid);
        for (const neighbor of unvisitedNeighbors) {
            //console.log(neighbor.row + " " + neighbor.col);
            //neighbor.isVisited = true;
            visitedNodesStack.push(neighbor);
        }
    }
    return visitedNodesInOrder;
}

function updateUnvisitedNeighbors(node, grid) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        //neighbor.distance = node.distance + 1;
        neighbor.previousNode = node;
    }
    return unvisitedNeighbors;
}

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { row, col } = node;
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    if (row > 0) neighbors.push(grid[row - 1][col]);

    return neighbors.filter((neighbor) => !neighbor.isVisited);
}

export function getNodesInShortestPathDFS(targetNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = targetNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}
