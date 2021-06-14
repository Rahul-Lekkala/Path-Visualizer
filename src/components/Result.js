import React from "react";

export default function Result() {
    const {
        numberOfGridsSearched,
        numberOfGridsinShortestPath,
        timeTaken,
    } = this.props;

    return (
        <div>
            numberOfGridsSearched = {numberOfGridsSearched}
            numberOfGridsinShortestPath = {numberOfGridsinShortestPath}
            timeTaken = {timeTaken}
        </div>
    );
}
