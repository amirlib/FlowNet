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
    this.edgeClick = false; //System will know if there a new edge action or not(without render the page)
    this.mouseHoverNodeID = undefined; //Which node ID it, while mouse hover on node
    this.state = {
      flowArr: props.flowArr
    };
  }

  setNode(corX, corY) {
    let flowArr = this.state.flowArr;
    let nodeObj = {
      id: flowArr.length,
      corX,
      corY,
      radius: final.nodeRadius,
      objectType: 'node'
    };
    flowArr.push(nodeObj);
    this.setState({ flowArr });
  }

  setEdge(from) {
    let flowArr = this.state.flowArr;
    let edgeObj = {
      id: flowArr.length,
      from,
      corX: from.corX,
      corY: from.corY,
      toID: from.id,
      objectType: 'edge'
    };
    flowArr.push(edgeObj);
    this.setState({ flowArr });
  }

  identifySituation(x, y) {
    if (this.props.action === 'node') {
      if (lib.isNodeOnNode(this.state.flowArr) === false) {
        return 'final-node';
      }
    }
    if (this.props.action === 'none' && this.mouseHoverNodeID !== undefined && this.edgeClick === false) {
      return 'starting-edge';
    }
    if (this.props.action === 'none' && this.edgeClick === true) {
      const toID = lib.mouseOnNode(x, y, this.state.flowArr); //Get the ID of node where the mouse is inside
      if (this.isSafeFinalClick(toID)) {
        return 'final-edge';
      }
    }
    return 'none'
  }

  isSafeFinalClick(ID) {
    const flowArr = this.state.flowArr;
    if (ID === -1 || flowArr[flowArr.length - 1].from.id === ID || lib.searchSameEdges(flowArr, ID) === true) {
      return false;
    }
    return true;
  }

  canvasMouseMove(event) {
    console.log(`Canvas canvasMouseMove`);
    if (this.props.action === 'node' || this.edgeClick === true) { //While there is a new node OR new edge action
      console.log(`Canvas canvasMouseMove: INSIDE`);
      let flowArr = this.state.flowArr;
      flowArr[flowArr.length - 1].corX = lib.mouseOnCanvasCorX(event.pageX); //Update the X oordinate
      flowArr[flowArr.length - 1].corY = event.pageY - final.headerHeight; //Update the Y oordinate
      this.setState({ flowArr });
    }
  }

  canvasClick(event) {
    console.log(`Canvas canvasClick`);
    const situation = this.identifySituation(event.pageX, event.pageY);
    switch (situation) {
      case 'final-node':
        this.props.actionFromCanvas('none');
        this.props.flowappFromCanvas(this.state.flowArr);
        break;
      case 'starting-edge':
        this.edgeClick = true;
        this.setEdge(this.state.flowArr[this.mouseHoverNodeID]);
        lib.buttonsHandler(true, true, false);
        break;
      case 'final-edge':
        const flowArr = this.state.flowArr;
        const toID = lib.mouseOnNode(event.pageX, event.pageY, flowArr); //Get the ID of node where the mouse is inside
        flowArr[flowArr.length - 1].toID = toID; //Update the ID of end node
        this.props.flowappFromCanvas(this.state.flowArr); //Update the flowArr in the App component
        this.edgeClick = false;
        lib.buttonsHandler(false, false, true);
        break;
      default:
        event.preventDefault();
    }
  }

  getIDFromNode(info) {
    this.mouseHoverNodeID = info;
  }

  componentWillMount() {
    console.log(`Canvas componentWillMount`);
    if (this.state.flowArr.length < 3) {
      this.setNode(50, 350);
      this.setNode(650, 350);
      this.props.flowappFromCanvas(this.state.flowArr);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.action !== prevProps.action) {
      switch (this.props.action) {
        case 'stop':
          console.log(`Canvas componentDidUpdate - action: STOP`);
          this.edgeClick = false;
          this.mouseHoverNodeID = undefined;
          this.props.actionFromCanvas('none');
          break;
        case 'node':
          console.log(`Canvas componentDidUpdate - action: NODE`);
          this.setNode(350, 350);
          break;
        default:
      }
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
          {this.state.flowArr.map(obj => {
            if (obj.objectType === 'node') {
              return <Node key={'node-' + obj.id} nodeObj={obj} idFromNode={this.getIDFromNode} />;
            } else {
              return <Edge key={'edge-' + obj.id} edgeObj={obj} />;
            }
          })}
        </svg>
      </div>
    );
  }
}

export default Canvas;
