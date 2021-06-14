import React, { Component } from "react";
import "./Node.css";

export default class Node extends Component {
    render() {
        const {
            row,
            col,
            isStart,
            isTarget,
            isWall,
            onMouseDown,
            onMouseEnter,
            onMouseUp,
        } = this.props;

        const blockClassName = isStart
            ? "node-start"
            : isTarget
            ? "node-end"
            : isWall
            ? "node-wall"
            : "";

        return (
            <td
                id={"node-" + row + "-" + col}
                className={blockClassName}
                onMouseDown={() => onMouseDown(row, col)}
                onMouseEnter={() => onMouseEnter(row, col)}
                onMouseUp={() => onMouseUp()}
            ></td>
        );
    }
}
