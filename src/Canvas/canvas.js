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
    this.setEdge = this.setEdge.bind(this);
    this.errorNodeClick = true; //System will know if there a collision between two nodes (while creating a new node)
    this.edgeClick = false; //System will know if there a new edge action or not(without render the page)
    this.nodeID = undefined; //Which node ID it, while mouse hover on node
    this.state = {
      flowArr: this.props.flowArr, //Array of all the nodes and edges of the network 
      action: this.props.action //System will know if there is a new node action or not
    };
  }
  /**
 * Create new edge and saving it information to the array
 * @param {number} corX - The X coordinate of the center of node
 * @param {number} corY  - The Y coordinate of the center of node
 */
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
  /**
   * Create new edge and saving it information to the array
   * @param {Object} startNode - The start node object of the edge
   * @param {number} startNodeID - The ID of start node
   * @param {number} corX - The X coordinate of the end of the edge
   * @param {number} corY - The Y coordinate of the end of the edge
   * @param {number} endNodeID - The ID of end node
   */
  setEdge(startNode, startNodeID, corX, corY, endNodeID) {
    let flowArr = this.state.flowArr;
    let edgeObj = { //Creating an object with information on the edge to be save
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
  /**
   * Method of the mouse move event on the Canvas component
   */
  canvasMouseMove(event) {
    if (this.state.action === 'node' || this.edgeClick !== false) { //While there is a new node OR new edge action
      let flowArr = this.state.flowArr;
      flowArr[flowArr.length - 1].corX = lib.mouseOnCanvasCorX(event.pageX); //Update the X oordinate
      flowArr[flowArr.length - 1].corY = event.pageY - final.headerHeight; //Update the Y oordinate
      this.setState({ flowArr });
      this.errorNodeClick = lib.nodeOnNode(flowArr); //Check if there a collision between two nodes
    }
  }
  /**
   * Method of the click event on the Canvas component
   */
  canvasClick(event) {
    if (this.state.action === 'node' && this.errorNodeClick === false) { //When there is a new node action and no collision between two nodes
      this.props.getActionFromCanvas('none'); //Update the action state - The end of creating node
      this.props.CanvasPipelineApp(this.state.flowArr); //Update the flowArr in the App component
      lib.buttonsHandler(false, false, true);
    } else if (this.nodeID !== undefined && this.edgeClick === false && this.state.action === 'none') { //When there is the first click of the edge (the strat edge)
      let flowArr = this.state.flowArr;
      this.edgeClick = true;
      this.setEdge(flowArr[this.nodeID], this.nodeID, flowArr[this.nodeID].corX, flowArr[this.nodeID].corY, this.nodeID);
      lib.buttonsHandler(true, true, false);
    } else if (this.edgeClick === true && this.state.action === 'none') { //When there is the second click of the edge (the end edge)
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
        this.props.CanvasPipelineApp(this.state.flowArr); //Update the flowArr in the App component
        this.edgeClick = false;
        lib.buttonsHandler(false, false, true);
      }
    }
  }
  /**
   * Get the ID of node when the mouse is inside.
   * @param {number} info - The ID of node
   */
  getIDFromNode(info) {
    this.nodeID = info;
  }
  /**
   * Set two default nodes. One for the source and second for the sink
   */
  componentDidMount() {
    console.log(`Canvas componentDidMount`);
    if (this.state.flowArr.length < 3) {
      let flowArr = this.state.flowArr;
      this.setNode(50, 350);
      this.setNode(650, 350);
      this.setState({ flowArr });
    }
  }
  /**
   * If recived the "stop" action then stop the process of creating new object and delete it from flowArr. Update the state of action from the Canvas component
   */
  componentDidUpdate(prevProps, prevState) {
    if (this.props.action === 'stop') {
      console.log(`Canvas componentDidUpdate - action: STOP`);
      this.errorNodeClick = true;
      this.edgeClick = false;
      this.nodeID = undefined;
      this.props.getActionFromCanvas('none');
    }
    if (this.props.action !== this.state.action && this.props.action === 'node') {
      console.log(`Canvas componentDidUpdate - action: NODE`);
      let flowArr = this.state.flowArr;
      this.setNode(350, 350); //Send the Coordinates
      this.setState({ flowArr });
    }
    if (this.state.action !== this.props.action) {
      console.log(`Canvas componentDidUpdate - action`);
      this.setState({
        action: this.props.action
      });
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
            if (this.state.flowArr[id].objectType === 'node') {
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
