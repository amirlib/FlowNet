import React, { Component } from 'react';
import './node.css';

class Node extends Component {
  constructor(props) {
    super(props);
    this.nodeMouseOut = this.nodeMouseOut.bind(this);
    this.nodeMouseEnter = this.nodeMouseEnter.bind(this);
  }

  nodeMouseEnter() {
    this.props.idFromNode(this.props.node.id);
  }

  nodeMouseOut() {
    this.props.idFromNode(undefined);
  }

  render() {
    return (
      <circle
        cx={this.props.node.coorX}
        cy={this.props.node.coorY}
        r={this.props.node.radius}
        onMouseEnter={this.nodeMouseEnter}
        onMouseOut={this.nodeMouseOut}
        style={{
          stroke: 'black',
          strokeWidth: '1',
          fill: '#d7dadb'
        }} />
    );
  }
}

export default Node;
