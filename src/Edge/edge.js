import React from "react";

function Edge(props) {
  return (
    <line
      x1={props.edge.from.coorX}
      y1={props.edge.from.coorY}
      x2={props.edge.coorX}
      y2={props.edge.coorY}
      style={{
        stroke: "black",
        strokeWidth: "1"
      }}
    />
  );
}

export default Edge;
