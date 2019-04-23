import React, { Component } from 'react';
import './edge.css';

class Edge extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startNode: this.props.edgeObj.startNode, //The start node object of the edge
            startNodeID: this.props.edgeObj.startNodeID, //The ID of start node
            corX: this.props.edgeObj.corX, //The X coordinate of the end of the edge
            corY: this.props.edgeObj.corY, //The Y coordinate of the end of the edge
            endNodeID: this.props.edgeObj.endNodeID //The ID of end node
        }
    }

    componentDidUpdate() {
      console.log(`Edge componentDidUpdate`);
        if (this.props.edgeObj.corX !== this.state.corX || this.props.edgeObj.corY !== this.state.corY) {
            this.setState({
                corX: this.props.edgeObj.corX,
                corY: this.props.edgeObj.corY,
                endNodeID: this.props.edgeObj.endNodeID
            });
        }
    }

    render() {
      console.log(`Edge render`);
        return (
            <line x1={this.state.startNode.corX} y1={this.state.startNode.corY} x2={this.state.corX} y2={this.state.corY} style={{
                stroke: 'black',
                strokeWidth: '1'
            }} />
        );
    }
}

export default Edge;
