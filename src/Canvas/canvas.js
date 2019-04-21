import React, { Component } from 'react';
import * as lib from '../lib';
import * as final from '../final';
import Node from '../Node/node.js';
import Edge from '../Edge/edge.js';
import './canvas.css';

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.canvasMouseMove = this.canvasMouseMove.bind(this);
    this.getIDFromNode = this.getIDFromNode.bind(this);
    this.canvasClick = this.canvasClick.bind(this);
    this.errorNodeClick = true; //System will know if there a collision between two nodes (while creating a new node)
    this.edgeClick = false; //System will know if there a new edge action or not(without render the page)
    this.nodeID = undefined; //Which node ID it, while mouse hover on node
    this.state = {
      flowArr: this.props.flowArr
    };
  }

  setNode(corX, corY) {
    let flowArr = this.state.flowArr;
    let nodeObj = {
      corX,
      corY,
      radius: final.nodeRadius,
      objectType: 'node'
    };
    flowArr.push(nodeObj);
    this.setState({ flowArr });
  }

  setEdge(startNode, startNodeID, corX, corY, endNodeID) {
    let flowArr = this.state.flowArr;
    let edgeObj = {
      startNode,
      startNodeID,
      corX,
      corY,
      endNodeID,
      objectType: 'edge'
    };
    flowArr.push(edgeObj);
    this.setState({ flowArr });
  }

  canvasMouseMove(event) {
    if (this.props.action === 'node' || this.edgeClick !== false) { //While there is a new node OR new edge action
      let flowArr = this.state.flowArr;
      flowArr[flowArr.length - 1].corX = lib.mouseOnCanvasCorX(event.pageX); //Update the X oordinate
      flowArr[flowArr.length - 1].corY = event.pageY - final.headerHeight; //Update the Y oordinate
      this.setState({ flowArr });
      this.errorNodeClick = lib.nodeOnNode(flowArr); //Check if there a collision between two nodes
    }
  }

  canvasClick(event) {
    if (this.props.action === 'node' && this.errorNodeClick === false) { //When there is a new node action and no collision between two nodes
      this.props.actionFromCanvas('none'); //Update the action state - The end of creating node
      this.props.flowapFromCanvas(this.state.flowArr); //Update the flowArr in the App component
      lib.buttonsHandler(false, false, true);
    } else if (this.nodeID !== undefined && this.edgeClick === false && this.props.action === 'none') { //When there is the first click of the edge (the strat edge)
      let flowArr = this.state.flowArr;
      this.edgeClick = true;
      this.setEdge(flowArr[this.nodeID], this.nodeID, flowArr[this.nodeID].corX, flowArr[this.nodeID].corY, this.nodeID);
      lib.buttonsHandler(true, true, false);
    } else if (this.edgeClick === true && this.props.action === 'none') { //When there is the second click of the edge (the end edge)
      let flowArr = this.state.flowArr;
      let endNodeID = lib.mouseOnNode(lib.mouseOnCanvasCorX(event.pageX), event.pageY - final.headerHeight, flowArr); //Get the ID of node where the mouse is inside
      if (endNodeID === -1) {
        console.log(`Can't make legal edge`);
      } else if (flowArr[flowArr.length - 1].startNodeID === endNodeID) {
        console.log('Same node');
      } else if (lib.searchSameEdges(flowArr, endNodeID) === true) {
        console.log('Same edge');
      } else {
        flowArr[flowArr.length - 1].corX = lib.mouseOnCanvasCorX(event.pageX); //Update the X oordinate
        flowArr[flowArr.length - 1].corY = event.pageY - final.headerHeight; //Update the Y oordinate
        flowArr[flowArr.length - 1].endNodeID = endNodeID; //Update the ID of end node
        this.props.flowapFromCanvas(this.state.flowArr); //Update the flowArr in the App component
        this.edgeClick = false;
        lib.buttonsHandler(false, false, true);
      }
    }
  }

  getIDFromNode(info) {
    this.nodeID = info;
  }

  componentDidMount() {
    console.log(`Canvas componentDidMount`);
    if (this.state.flowArr.length < 3) {
      this.setNode(50, 350);
      this.setNode(650, 350);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.action !== prevProps.action && this.props.action === 'stop') {
      console.log(`Canvas componentDidUpdate - action: STOP`);
      this.errorNodeClick = true;
      this.edgeClick = false;
      this.nodeID = undefined;
      this.props.actionFromCanvas('none');
    }
    if (this.props.action !== prevProps.action && this.props.action === 'node') {
      console.log(`Canvas componentDidUpdate - action: NODE`);
      this.setNode(350, 350);
    }
  }

  render() {
    console.log(`Canvas render`);
    return (
      <div className='canvas-root' id='canvas-root' onMouseMove={this.canvasMouseMove} onClick={this.canvasClick}>
        <svg height='700' width='700'>
          <defs>
            <marker id="arrow" markerWidth="13" markerHeight="13" refX="0.1" refY="6" orient="auto">
              <path d="M2,2 L2,13 L8,7 L2,2" style={{ fill: 'red' }} />
            </marker>
          </defs>
          {this.state.flowArr.map((obj, id) => {
            if (obj.objectType === 'node') {
              return <Node key={'node-' + id} id={id} nodeObj={obj} getIDFromNode={this.getIDFromNode} />;
            } else {
              return <Edge key={'edge-' + id} id={id} edgeObj={obj} />;
            }
          })}
        </svg>
      </div>
    );
  }
}

export default Canvas;
