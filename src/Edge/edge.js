import React, { Component } from 'react';
import './edge.css';

class Edge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      corX: props.edgeObj.corX, //The X coordinate of the end edge
      corY: props.edgeObj.corY, //The Y coordinate of the end edge
      toID: undefined //The ID of end node
    }
  }

  componentDidUpdate() {
    if (this.props.edgeObj.corX !== this.state.corX || this.props.edgeObj.corY !== this.state.corY) {
      this.setState({
        corX: this.props.edgeObj.corX,
        corY: this.props.edgeObj.corY,
        toID: this.props.edgeObj.toID
      });
    }
  }

  render() {
    return (
      <line x1={this.props.edgeObj.from.corX} y1={this.props.edgeObj.from.corY} x2={this.state.corX} y2={this.state.corY} style={{
        stroke: 'black',
        strokeWidth: '1'
      }} />
    );
  }
}

export default Edge;
