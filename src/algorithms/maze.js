export function wallsInMaze(grid, startNode, targetNode)
{
      const visitedNodesInOrder = [];
      const unvisitedNodes = getAllNodes(grid, startNode, targetNode);

      
}

function getAllNodes(grid)
{
      const nodes = [];
      for (const row of grid) {
            for (const node of row) {
                nodes.push(node);
            }
        }
      return nodes;
}