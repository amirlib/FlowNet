import React, { Component } from 'react';
import './edge.css';

class Edge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      corX: props.edgeObj.corX,
      corY: props.edgeObj.corY,
      toID: undefined
    }
  }

  componentDidUpdate() {
    console.log(`Edge componentDidUpdate`);
    if (this.props.edgeObj.corX !== this.state.corX || this.props.edgeObj.corY !== this.state.corY) {
      this.setState({
        corX: this.props.edgeObj.corX,
        corY: this.props.edgeObj.corY,
        toID: this.props.edgeObj.toID
      });
    }
  }

  render() {
    console.log(`Edge render`);
    return (
      <line x1={this.props.edgeObj.from.corX} y1={this.props.edgeObj.from.corY} x2={this.state.corX} y2={this.state.corY} style={{
        stroke: 'black',
        strokeWidth: '1'
      }} />
    );
  }
}

export default Edge;
