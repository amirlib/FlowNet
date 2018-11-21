import React, { Component } from 'react';
import './edge.css';

class Edge extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nodeOut: this.props.edgeObj.nodeOut,
            nodeOutID: this.props.edgeObj.nodeOutID,
            corX: this.props.edgeObj.corX,
            corY: this.props.edgeObj.corY,
            nodeInID: this.props.edgeObj.nodeInID
        }
    }

    componentDidUpdate() {
        if (this.props.edgeObj.corX !== this.state.corX || this.props.edgeObj.corY !== this.state.corY) {
            this.setState({
                corX: this.props.edgeObj.corX,
                corY: this.props.edgeObj.corY,
                nodeInID: this.props.edgeObj.ID
            });
        }
    }

    render() {
        return (
            <line x1={this.state.nodeOut.corX} y1={this.state.nodeOut.corY} x2={this.state.corX} y2={this.state.corY} style={{
                stroke: 'black',
                strokeWidth: '1'
            }} />
        );
    }
}

export default Edge;
