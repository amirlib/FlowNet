import React, { Component } from 'react';
import './node.css';

class Node extends Component {
  constructor(props) {
    super(props);
    this.nodeMouseOut = this.nodeMouseOut.bind(this);
    this.nodeMouseEnter = this.nodeMouseEnter.bind(this);
    this.state = {
      corX: props.nodeObj.corX,
      corY: props.nodeObj.corY
    };
  }

  nodeMouseEnter() {
    this.props.idFromNode(this.props.nodeObj.id);
  }

  nodeMouseOut() {
    this.props.idFromNode(undefined);
  }

  componentDidUpdate() {
    if (this.props.nodeObj.corX !== this.state.corX || this.props.nodeObj.corY !== this.state.corY) {
      this.setState({
        corX: this.props.nodeObj.corX,
        corY: this.props.nodeObj.corY
      });
    }
  }

  render() {
    return (
      <circle cx={this.state.corX} cy={this.state.corY} r={this.props.nodeObj.radius} onMouseEnter={this.nodeMouseEnter} onMouseOut={this.nodeMouseOut} style={{
        stroke: 'black',
        strokeWidth: '1',
        fill: '#d7dadb'
      }} />
    );
  }
}

export default Node;
