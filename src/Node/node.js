import React, { Component } from 'react';
import './node.css';

class Node extends Component {
  constructor(props) {
    super(props);
    this.nodeMouseOut = this.nodeMouseOut.bind(this);
    this.nodeMouseEnter = this.nodeMouseEnter.bind(this);
    this.state = {
      corX: this.props.nodeObj.corX, //The X coordinate of the center of node
      corY: this.props.nodeObj.corY //The Y coordinate of the center of node
    };
  }

  nodeMouseEnter() {
    this.props.idFromNode(this.props.nodeObj.id); //Send the ID node to the Canvas component
  }

  nodeMouseOut() {
    this.props.idFromNode(undefined); //Send undefined as an ID node to the Canvas component
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
