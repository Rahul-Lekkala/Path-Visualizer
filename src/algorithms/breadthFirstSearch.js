export function breadthFirstSearch(grid, startNode, targetNode) {
    console.log("In BFS");

    const visitedNodesInOrder = [];
    //startNode.distance = 0;
    //const unvisitedNodes = getAllNodes(grid);
    //visitedNodesInOrder.push(startNode);
    const visitedNodesQueue = [];
    visitedNodesQueue.push(startNode);
    while (visitedNodesQueue.length > 0) {
        const currentNode = visitedNodesQueue.shift();
        // console.log("Length = ", visitedNodesQueue.length);
        //  console.log("currentNode " + currentNode.row + " " + currentNode.col);

        if (currentNode.isWall) continue;

        //if (currentNode.distance === Infinity) return visitedNodesInOrder;

        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode);

        //console.log(visitedNodesInOrder);

        if (currentNode === targetNode) {
            console.log("Target Found " + visitedNodesQueue.length);
            console.log(visitedNodesInOrder.length);
            return visitedNodesInOrder;
        }

        const unvisitedNeighbors = updateUnvisitedNeighbors(currentNode, grid);
        for (const neighbor of unvisitedNeighbors) {
            //console.log(neighbor.row + " " + neighbor.col);
            neighbor.isVisited = true;
            visitedNodesQueue.push(neighbor);
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
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

    return neighbors.filter((neighbor) => !neighbor.isVisited);
}

export function getNodesInShortestPathBFS(targetNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = targetNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}
