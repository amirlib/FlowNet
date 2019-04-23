import React, { Component } from 'react';
import './node.css';

class Node extends Component {
    constructor(props) {
        super(props);
        this.nodeMouseOut = this.nodeMouseOut.bind(this);
        this.nodeMouseEnter = this.nodeMouseEnter.bind(this);
        this.state = {
            corX: this.props.nodeObj.corX, //The X coordinate of the center of node
            corY: this.props.nodeObj.corY, //The Y coordinate of the center of node
            radius: this.props.nodeObj.radius //The radius of node
        };
    }
    /**
     * Method of the mouse enter event on the Node component
     */
    nodeMouseEnter() {
      console.log(`Node nodeMouseEnter`);
        this.props.getIDFromNode(this.props.id); //Send the ID node to the Canvas component
    }
    /**
     * Method of the mouse Out event on the Node component
     */
    nodeMouseOut() {
      console.log(`Node nodeMouseOut`);
        this.props.getIDFromNode(undefined); //Send undefined as an ID node to the Canvas component
    }

    componentDidUpdate() {
      console.log(`Node componentDidUpdate`);
        if (this.props.nodeObj.corX !== this.state.corX || this.props.nodeObj.corY !== this.state.corY) {
            this.setState({
                corX: this.props.nodeObj.corX,
                corY: this.props.nodeObj.corY
            });
        }
    }

    render() {
      console.log(`Node render`);
        return (
            <circle cx={this.state.corX} cy={this.state.corY} r={this.state.radius} onMouseEnter={this.nodeMouseEnter} onMouseOut={this.nodeMouseOut} style={{
                stroke: 'black',
                strokeWidth: '1',
                fill: '#d7dadb'
            }} />
        );
    }
}

export default Node;
