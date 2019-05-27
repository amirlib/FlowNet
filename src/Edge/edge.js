import React, { Component } from 'react';
import './edge.css';

class Edge extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <line
        x1={this.props.edge.from.coorX}
        y1={this.props.edge.from.coorY}
        x2={this.props.edge.coorX}
        y2={this.props.edge.coorY}
        style={{
          stroke: 'black',
          strokeWidth: '1'
        }} />
    );
  }
}

export default Edge;
