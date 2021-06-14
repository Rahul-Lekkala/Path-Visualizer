import React, { Component } from "react";
import "./Path.css";
import Node from "./Node";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";
import { astar, getNodesInShortestPathAStar } from "../algorithms/astar2";
import {
    breadthFirstSearch,
    getNodesInShortestPathBFS,
} from "../algorithms/breadthFirstSearch";
import {
    depthFirstSearch,
    getNodesInShortestPathDFS,
} from "../algorithms/depthFirstSearch";
import {
    bestFirstSearch,
    getNodesInShortestPathBestFirstSearch,
} from "../algorithms/bestFirstSearch";
import Result from "./Result";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { fas, fa-street-view } from "@fortawesome/free-solid-svg-icons";

// let START_NODE_ROW = 15;
// let START_NODE_COL = 15;
// let TARGET_NODE_ROW = 20;
// let TARGET_NODE_COL = 45;

export default class Path extends Component {
    constructor() {
        super();
        this.state = {
            grid: [],
            mouseIsPressed: false,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            numberOfGridsSearched: -1,
            numberOfGridsinShortestPath: -1,
            timeTaken: -1,
            isWallPressed: false,
            isStartNodePressed: false,
            isTargetNodePressed: false,
            START_NODE_ROW: 10,
            START_NODE_COL: 7,
            TARGET_NODE_ROW: 3,
            TARGET_NODE_COL: 19,
            PREV_ROW: 10,
            PREV_COL: 7,
        };
    }

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
        this.constructGrid();
    }

    handleMouseDown(row, col) {
        //console.log("Mouse Down");
        let newGrid;
        const {
            START_NODE_ROW,
            START_NODE_COL,
            TARGET_NODE_ROW,
            TARGET_NODE_COL,
        } = this.state;

        //console.log("Start Node :", START_NODE_ROW, START_NODE_ROW);
        //console.log("Current Node :", row, col);
        if (row === START_NODE_ROW && col === START_NODE_COL) {
            //console.log("Toggled Start Node");

            this.setState({
                PREV_ROW: row,
                PREV_COL: col,
                isStartNodePressed: true,
            });
        } else if (row === TARGET_NODE_ROW && col === TARGET_NODE_COL) {
            //newGrid = getNewGridWithTargetNodeToggled(this.state.grid,row,col);
            this.setState({
                PREV_ROW: row,
                PREV_COL: col,
                isTargetNodePressed: true,
            });
        } else {
            newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
            this.setState({ grid: newGrid, mouseIsPressed: true });
        }
        //console.log(newGrid[row][col].isWall);
    }

    handleMouseEnter(row, col) {
        const { PREV_ROW, PREV_COL } = this.state;
        if (this.state.isStartNodePressed) {
            const newGrid = getNewGridWithStartNodeToggled(
                this.state.grid,
                row,
                col,
                PREV_ROW,
                PREV_COL
            );
            this.setState({
                grid: newGrid,
                START_NODE_ROW: row,
                START_NODE_COL: col,
                PREV_ROW: row,
                PREV_COL: col,
            });
            //this.constructGrid();
        } else if (this.state.isTargetNodePressed) {
            const newGrid = getNewGridWithTargetNodeToggled(
                this.state.grid,
                row,
                col,
                PREV_ROW,
                PREV_COL
            );

            this.setState({
                grid: newGrid,
                TARGET_NODE_ROW: row,
                TARGET_NODE_COL: col,
                PREV_ROW: row,
                PREV_COL: col,
            });
        } else if (this.state.mouseIsPressed) {
            const newGrid = getNewGridWithWallToggled(
                this.state.grid,
                row,
                col
            );
            this.setState({ grid: newGrid });
        }
    }

    handleMouseUp() {
        this.setState({
            mouseIsPressed: false,
            isStartNodePressed: false,
            isTargetNodePressed: false,
        });
    }

    handleResize = (e) => {
        this.setState({ windowWidth: window.innerWidth });
        this.setState({ windowHeight: window.innerHeight });
        this.constructGrid();
    };

    constructGrid() {
        let numberOfRows = 0;
        let numberOfColumns = 0;
        //   if (this.state.windowHeight >= 400 && this.state.windowHeight <= 600) {
        //       numberOfRows = 25;
        //   }
        //   if (this.state.windowWidth >= 600 && this.state.windowWidth <= 800) {
        //       numberOfColumns = 40;
        //   } else if (
        //       this.state.windowWidth >= 800 &&
        //       this.state.windowWidth <= 1200
        //   ) {
        //       numberOfColumns = 60;
        //   }
        //Calculate number of rows and columns based on the page height and width
        //   numberOfRows = Math.floor(this.state.windowHeight / 21);
        //   numberOfColumns = Math.floor(this.state.windowWidth / 19);
        numberOfRows = Math.floor(this.state.windowHeight / 27);
        numberOfColumns = Math.floor(this.state.windowWidth / 25);

        let {
            START_NODE_ROW,
            START_NODE_COL,
            TARGET_NODE_ROW,
            TARGET_NODE_COL,
        } = this.state;

        // START_NODE_ROW = TARGET_NODE_ROW = Math.floor(numberOfRows / 2);
        // START_NODE_COL = Math.floor(numberOfColumns / 4);
        // TARGET_NODE_COL = Math.floor((2 * numberOfColumns) / 3);
        // TARGET_NODE_ROW = 3;

        //console.log(this.state.windowHeight, numberOfRows);
        //console.log(numberOfColumns);
        const grid = [];
        for (let row = 0; row < numberOfRows; row++) {
            const currentRow = [];
            for (let col = 0; col < numberOfColumns; col++) {
                const currentNode = {
                    col,
                    row,
                    isStart: row === START_NODE_ROW && col === START_NODE_COL,
                    isTarget:
                        row === TARGET_NODE_ROW && col === TARGET_NODE_COL,
                    distance: Infinity,
                    heuristicDistance: Infinity,
                    totalDistance: Infinity,
                    isVisited: false,
                    isWall: false,
                    previousNode: null,
                };
                currentRow.push(currentNode);
            }
            grid.push(currentRow);
        }
        this.setState({ grid });
    }

    animateShortestPath(nodesInShortestPathOrder) {
        if (nodesInShortestPathOrder.length === 1) {
            const node = nodesInShortestPathOrder[0];
            document.getElementById(`node-${node.row}-${node.col}`).className =
                "node-end-vis";
            return;
        }

        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                let className = "node node-shortest-path";
                if (i === 0) {
                    className += " node-start-vis";
                }
                if (i === nodesInShortestPathOrder.length - 1) {
                    className += " node-end-vis";
                }
                const node = nodesInShortestPathOrder[i];
                document.getElementById(
                    `node-${node.row}-${node.col}`
                ).className = className;
            }, 50 * i);
        }
    }

    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder);
                }, 20 * i);
                return;
            }
            setTimeout(() => {
                let className = "node-visited";
                if (i === 0) {
                    className += " node-start-vis";
                }
                if (i === visitedNodesInOrder.length - 1) {
                    console.log(visitedNodesInOrder[i].isVisited);
                    if (visitedNodesInOrder[i].isVisited)
                        className += " node-end-vis";
                }
                const node = visitedNodesInOrder[i];
                document.getElementById(
                    `node-${node.row}-${node.col}`
                ).className = className;
            }, 20 * i);
        }
    }

    animate(visitedNodesInOrder, nodesInShortestPathOrder, targetNode) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder);
                }, 20 * i);
                return;
            }
            setTimeout(() => {
                let className = "node-visited";
                if (i === 0) {
                    className += " node-start-vis";
                }
                if (i === visitedNodesInOrder.length - 1) {
                    if (
                        visitedNodesInOrder[i].row === targetNode.row &&
                        visitedNodesInOrder[i].col === targetNode.col
                    )
                        className += " node-end-vis";
                }
                const node = visitedNodesInOrder[i];
                document.getElementById(
                    `node-${node.row}-${node.col}`
                ).className = className;
            }, 20 * i);
        }
    }

    visualizeDijkstra() {
        //const { grid } = this.state;
        this.clearBoard(true, false);
        const {
            START_NODE_ROW,
            START_NODE_COL,
            TARGET_NODE_ROW,
            TARGET_NODE_COL,
            grid,
        } = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[TARGET_NODE_ROW][TARGET_NODE_COL];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);

        // visitedNodesInOrder.forEach((node) => {
        //     console.log(node.row + " " + node.col);
        // });

        const nodesInShortestPathOrder =
            getNodesInShortestPathOrder(finishNode);
        //this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
        this.animate(visitedNodesInOrder, nodesInShortestPathOrder, finishNode);
    }

    visualizeBFS() {
        //const { grid } = this.state;
        this.clearBoard(true, false);
        const {
            START_NODE_ROW,
            START_NODE_COL,
            TARGET_NODE_ROW,
            TARGET_NODE_COL,
            grid,
        } = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[TARGET_NODE_ROW][TARGET_NODE_COL];
        console.log("Start Node " + startNode.row + " " + startNode.col);
        console.log("Finish Node " + finishNode.row + " " + finishNode.col);

        const visitedNodesInOrder = breadthFirstSearch(
            grid,
            startNode,
            finishNode
        );

        console.log(visitedNodesInOrder.length);
        // visitedNodesInOrder.forEach((node) => {
        //     console.log(node.row + " " + node.col);
        // });

        //console.log("Visited Nodes ", visitedNodesInOrder);
        const nodesInShortestPathOrder = getNodesInShortestPathBFS(finishNode);
        console.log(nodesInShortestPathOrder.length);
        // nodesInShortestPathOrder.forEach((node) => {
        //     console.log(node.row + " " + node.col);
        // });
        //this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
        this.animate(visitedNodesInOrder, nodesInShortestPathOrder, finishNode);
    }

    visualizeDFS() {
        //const { grid } = this.state;
        this.clearBoard(true, false);
        const {
            START_NODE_ROW,
            START_NODE_COL,
            TARGET_NODE_ROW,
            TARGET_NODE_COL,
            grid,
        } = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[TARGET_NODE_ROW][TARGET_NODE_COL];
        console.log("Start Node " + startNode.row + " " + startNode.col);
        console.log("Finish Node " + finishNode.row + " " + finishNode.col);

        const visitedNodesInOrder = depthFirstSearch(
            grid,
            startNode,
            finishNode
        );

        console.log(visitedNodesInOrder.length);
        const nodesInShortestPathOrder = getNodesInShortestPathDFS(finishNode);
        //this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
        this.animate(visitedNodesInOrder, nodesInShortestPathOrder, finishNode);
    }

    visualizeAStar() {
        //const { grid } = this.state;
        this.clearBoard(true, false);
        const {
            START_NODE_ROW,
            START_NODE_COL,
            TARGET_NODE_ROW,
            TARGET_NODE_COL,
            grid,
        } = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[TARGET_NODE_ROW][TARGET_NODE_COL];
        console.log("Start Node " + startNode.row + " " + startNode.col);
        console.log("Finish Node " + finishNode.row + " " + finishNode.col);

        const visitedNodesInOrder = astar(grid, startNode, finishNode);

        console.log(visitedNodesInOrder.length);
        const nodesInShortestPathOrder =
            getNodesInShortestPathAStar(finishNode);
        this.animate(visitedNodesInOrder, nodesInShortestPathOrder, finishNode);
    }

    visualizeBestFirstSearch() {
        this.clearBoard(true, false);
        const {
            START_NODE_ROW,
            START_NODE_COL,
            TARGET_NODE_ROW,
            TARGET_NODE_COL,
            grid,
        } = this.state;

        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[TARGET_NODE_ROW][TARGET_NODE_COL];

        const visitedNodesInOrder = bestFirstSearch(
            grid,
            startNode,
            finishNode
        );

        console.log(visitedNodesInOrder.length);
        const nodesInShortestPathOrder =
            getNodesInShortestPathBestFirstSearch(finishNode);
        this.animate(visitedNodesInOrder, nodesInShortestPathOrder, finishNode);
    }

    clearBoard(clearpath, clearWall) {
        const {
            START_NODE_ROW,
            START_NODE_COL,
            TARGET_NODE_ROW,
            TARGET_NODE_COL,
            grid,
        } = this.state;
        console.log(grid[3][18].isVisited);
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[0].length; col++) {
                const node = grid[row][col];
                //console.log(node.row, node.col, node.isVisited);
                let newNode;
                if (clearpath) {
                    newNode = {
                        ...node,
                        distance: Infinity,
                        heuristicDistance: Infinity,
                        totalDistance: Infinity,
                        isVisited: false,
                        previousNode: null,
                    };
                }
                if (clearWall) {
                    newNode = {
                        ...node,
                        distance: Infinity,
                        heuristicDistance: Infinity,
                        totalDistance: Infinity,
                        isVisited: false,
                        isWall: false,
                        previousNode: null,
                    };
                }

                let className = "";
                if (row === START_NODE_ROW && col === START_NODE_COL) {
                    className = "node-start";
                }
                if (row === TARGET_NODE_ROW && col === TARGET_NODE_COL) {
                    className = "node-end";
                }

                if (!clearWall) {
                    if (node.isWall) {
                        className = "node-wall";
                    }
                }

                document.getElementById(
                    `node-${node.row}-${node.col}`
                ).className = className;
                //console.log(newNode.isVisited);
                grid[row][col] = newNode;
            }
        }
        this.setState({ grid });
    }

    render() {
        const {
            grid,
            mouseIsPressed,
            numberOfGridsSearched,
            numberOfGridsinShortestPath,
            timeTaken,
        } = this.state;

        //console.log(grid[3][18].isVisited);

        return (
            <>
                <button onClick={() => this.visualizeDijkstra()}>
                    Visulaize Dijkstra's
                </button>

                <button onClick={() => this.visualizeBFS()}>BFS</button>

                <button onClick={() => this.visualizeDFS()}>DFS</button>

                <button onClick={() => this.visualizeAStar()}>A Star</button>

                <button onClick={() => this.visualizeBestFirstSearch()}>
                    Best First Search
                </button>

                <button onClick={() => this.clearBoard(true, false)}>
                    Clear Path
                </button>
                <button onClick={() => this.clearBoard(true, true)}>
                    Reset Board
                </button>

                {numberOfGridsSearched !== -1 &&
                    numberOfGridsinShortestPath !== -1 &&
                    timeTaken !== -1 && (
                        <Result
                            numberOfGridsSearched={numberOfGridsSearched}
                            numberOfGridsinShortestPath={
                                numberOfGridsinShortestPath
                            }
                            timeTaken={timeTaken}
                        />
                    )}
                {/* <div className="grid" key={rowIndex}> */}

                <div className="map">
                    <table>
                        <tbody>
                            {grid.map((row, rowIndex) => {
                                return (
                                    <tr>
                                        {row.map((node, nodeIndex) => {
                                            const {
                                                row,
                                                col,
                                                isStart,
                                                isTarget,
                                                isVisited,
                                                isWall,
                                            } = node;
                                            return (
                                                <Node
                                                    key={rowIndex + nodeIndex}
                                                    isStart={isStart}
                                                    isTarget={isTarget}
                                                    isWall={isWall}
                                                    isVisited={isVisited}
                                                    mouseIsPressed={
                                                        mouseIsPressed
                                                    }
                                                    onMouseDown={(row, col) =>
                                                        this.handleMouseDown(
                                                            row,
                                                            col
                                                        )
                                                    }
                                                    onMouseEnter={(row, col) =>
                                                        this.handleMouseEnter(
                                                            row,
                                                            col
                                                        )
                                                    }
                                                    onMouseUp={() =>
                                                        this.handleMouseUp()
                                                    }
                                                    row={row}
                                                    col={col}
                                                ></Node>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </>
        );
    }
}

const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    // console.log(
    //     newGrid[row][col].row +
    //         " " +
    //         newGrid[row][col].col +
    //         " " +
    //         newGrid[row][col].isWall
    // );
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    // console.log(
    //     newGrid[row][col].row +
    //         " " +
    //         newGrid[row][col].col +
    //         " " +
    //         newGrid[row][col].isWall
    // );
    return newGrid;
};

const getNewGridWithStartNodeToggled = (grid, row, col, prev_row, prev_col) => {
    const newGrid = grid.slice();
    const currentNode = newGrid[row][col];
    const prevNode = newGrid[prev_row][prev_col];

    let newNode = {
        ...currentNode,
        isStart: true,
    };

    newGrid[row][col] = newNode;

    newNode = {
        ...prevNode,
        isStart: false,
    };

    newGrid[prev_row][prev_col] = newNode;

    // console.log(
    //     currentNode.row + " " + currentNode.col + " " + currentNode.isStart
    // );

    // console.log(prevNode.row + " " + prevNode.col + " " + prevNode.isStart);

    return newGrid;
};

const getNewGridWithTargetNodeToggled = (
    grid,
    row,
    col,
    prev_row,
    prev_col
) => {
    const newGrid = grid.slice();
    const currentNode = newGrid[row][col];
    const prevNode = newGrid[prev_row][prev_col];

    let newNode = {
        ...currentNode,
        isTarget: true,
    };

    newGrid[row][col] = newNode;

    newNode = {
        ...prevNode,
        isTarget: false,
    };

    newGrid[prev_row][prev_col] = newNode;

    // console.log(
    //     currentNode.row + " " + currentNode.col + " " + currentNode.isStart
    // );

    // console.log(prevNode.row + " " + prevNode.col + " " + prevNode.isStart);

    return newGrid;
};
