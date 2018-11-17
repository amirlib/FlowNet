import React, { Component } from 'react';
import * as lib from '../Canvas/lib'
import Node from '../Node/node.js';
import Edge from '../Edge/edge.js';
import './canvas.css';

class Canvas extends Component {
    constructor(props) {
        super(props);
        this.canvasMouseMove = this.canvasMouseMove.bind(this);
        this.getIDFromNode = this.getIDFromNode.bind(this);
        this.canvasClick = this.canvasClick.bind(this);
        this.setEdge = this.setEdge.bind(this);
        this.errorNodeClick = true;
        this.edgeClick = false;
        this.nodeID = undefined;
        this.state = {
            flowArr: this.props.flowArr,
            action: this.props.action
        };
    }

    setEdge(nodeOut, corX, corY) {
        let flowArr = this.state.flowArr;
        let edgeObj = {
            nodeOut,
            corX,
            corY,
            objectType: 'edge'
        };
        flowArr.push(edgeObj);
        this.setState({ flowArr });
    }

    canvasMouseMove(event) {
        if (this.state.action === 'node' || this.edgeClick !== false) {
            let flowArr = this.state.flowArr;
            const headerHeight = 50;
            flowArr[flowArr.length - 1].corX = lib.mouseOnCanvasCorX(event.pageX);
            flowArr[flowArr.length - 1].corY = event.pageY - headerHeight;
            this.setState({ flowArr });
            this.errorNodeClick = lib.nodeOnNode(flowArr);
        }
    }

    canvasClick(event) {
        if (this.state.action === 'node' && this.errorNodeClick === false) {
            this.props.getActionFromCanvas('none');
            this.props.getFlowArrFromCanvas(this.state.flowArr);
            lib.buttonsHandler(false, false, true);
        } else if (this.nodeID !== undefined && this.edgeClick === false && this.state.action === 'none') {
            let flowArr = this.state.flowArr;
            this.edgeClick = true;
            this.setEdge(flowArr[this.nodeID], flowArr[this.nodeID].corX, flowArr[this.nodeID].corY);
            lib.buttonsHandler(true, true, false);
        } else if (this.edgeClick === true && this.state.action === 'none') {
            let flowArr = this.state.flowArr;
            const headerHeight = 50;
            let nodeID = lib.mouseOnNode(lib.mouseOnCanvasCorX(event.pageX), event.pageY - headerHeight, flowArr);
            if (nodeID === -1) {
                console.log(`Can't make legal edge`);
            } else if (flowArr[flowArr.length - 1].nodeOut.corX === flowArr[nodeID].corX && flowArr[flowArr.length - 1].nodeOut.corY === flowArr[nodeID].corY) {
                console.log('Same node');
            } else if (lib.searchSameEdges(flowArr, nodeID) === true) {
                console.log('Same edge');
            } else {
                flowArr[flowArr.length - 1].corX = flowArr[nodeID].corX;
                flowArr[flowArr.length - 1].corY = flowArr[nodeID].corY;
                this.props.getFlowArrFromCanvas(this.state.flowArr);
                this.edgeClick = false;
                lib.buttonsHandler(false, false, true);
            }
        }
    }

    getIDFromNode(info) {
        this.nodeID = info;
    }

    componentWillMount() {
        if (this.state.flowArr.length < 3) {
            let flowArr = this.state.flowArr;
            flowArr = lib.setNode(50, 350, flowArr);
            flowArr = lib.setNode(650, 350, flowArr);
            this.setState({ flowArr });
        }
    }

    componentDidUpdate() {
        if (this.props.action === 'stop') {
            this.errorNodeClick = true;
            this.edgeClick = false;
            this.nodeID = undefined;
            this.props.getActionFromCanvas('none');
        }
        if (this.state.action !== this.props.action) {
            this.setState({
                action: this.props.action
            });
        }
    }

    render() {
        return (
            <div className='canvas-root' id='canvas-root' onMouseMove={this.canvasMouseMove} onClick={this.canvasClick}>
                <svg height='700' width='700'>
                    {this.state.flowArr.map((obj, id) => {
                        if (this.state.flowArr[id].objectType === 'node') {
                            return <Node key={'node-' + id} id={id} nodeObj={this.state.flowArr[id]} getIDFromNode={this.getIDFromNode} />;
                        } else {
                            return <Edge key={'edge-' + id} id={id} edgeObj={this.state.flowArr[id]} />;
                        }
                    })}
                </svg>
            </div>
        );
    }
}

export default Canvas;
