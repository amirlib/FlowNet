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
      flowArr: [{
        id: 0,
        coorX: 50,
        coorY: 350,
        radius: final.nodeRadius,
        objectType: 'node'
      }, {
        id: 1,
        coorX: 650,
        coorY: 350,
        radius: final.nodeRadius,
        objectType: 'node'
      }]
    };
  }

  setNode(coorX, coorY) {
    let flowArr = Array.from(this.state.flowArr);
    let nodeObj = {
      id: flowArr.length,
      coorX,
      coorY,
      radius: final.nodeRadius,
      objectType: 'node'
    };
    flowArr.push(nodeObj);
    this.setState({ flowArr });
  }

  setEdge(from) {
    let flowArr = Array.from(this.state.flowArr);
    let edgeObj = {
      id: flowArr.length,
      from,
      coorX: from.coorX,
      coorY: from.coorY,
      toID: from.id,
      objectType: 'edge'
    };
    flowArr.push(edgeObj);
    this.setState({ flowArr });
  }

  identifySituation(x, y) {
    if (this.props.action === 'node' && this.isNodeOnNode() === false) {
      return 'final-node';
    }
    if (this.props.action === 'none' && this.mouseHoverNodeID !== undefined && this.edgeClick === false) {
      return 'starting-edge';
    }
    if (this.props.action === 'none' && this.edgeClick === true) {
      const toID = this.getIDNodeMouseOn(x, y, this.state.flowArr);
      if (this.isSafeFinalClick(toID)) {
        return 'final-edge';
      }
    }
    return 'none'
  }

  isSafeFinalClick(ID) {
    const flowArr = this.state.flowArr;
    if (ID === -1 || flowArr[flowArr.length - 1].from.id === ID || this.isSameEdge(ID) === true) {
      return false;
    }
    return true;
  }

  canvasMouseMove(event) {
    if (this.props.action === 'node' || this.edgeClick === true) {
      console.log(`Canvas canvasMouseMove: INSIDE`);
      let flowArr = Array.from(this.state.flowArr);
      flowArr[flowArr.length - 1].coorX = this.getMouseOnCanvasCoorX(event.pageX);
      flowArr[flowArr.length - 1].coorY = event.pageY - final.headerHeight;
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
        let flowArr = Array.from(this.state.flowArr);
        const toID = this.getIDNodeMouseOn(event.pageX, event.pageY, flowArr);
        flowArr[flowArr.length - 1].toID = toID;
        this.setState({ flowArr });
        this.props.flowappFromCanvas(flowArr);
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

  isNodeOnNode() {
    const flowArr = this.state.flowArr;
    const node = flowArr[flowArr.length - 1];
    for (let i = 0; i < flowArr.length - 1; i++) {
      const distance = Math.sqrt((node.coorX - flowArr[i].coorX) ** 2 + (node.coorY - flowArr[i].coorY) ** 2);
      if (2 * flowArr[i].radius >= distance) {
        return true;
      }
    }
    return false;
  }

  getIDNodeMouseOn(x, y) {
    const flowArr = this.state.flowArr;
    const coorX = this.getMouseOnCanvasCoorX(x);
    const coorY = y - final.headerHeight;
    for (let i = 0; i < flowArr.length - 1; i++) {
      const distance = Math.sqrt((coorX - flowArr[i].coorX) ** 2 + (coorY - flowArr[i].coorY) ** 2);
      if (flowArr[i].radius >= distance) {
        return i;
      }
    }
    return -1;
  }

  getMouseOnCanvasCoorX(mouseCoorX) {
    if (document.body.clientWidth > final.mainWidth) {
      return mouseCoorX - (document.body.clientWidth - final.mainWidth) / 2;
    }
    return mouseCoorX;
  }

  isSameEdge(toID) {
    const flowArr = this.state.flowArr;
    const edge = flowArr[flowArr.length - 1];
    for (let i = 0; i < flowArr.length - 1; i++) {
      if (flowArr[i].objectType === 'edge' && flowArr[i].from.id === edge.from.id) {
        if (flowArr[i].toID === toID) {
          return true;
        }
      }
    }
    return false;
  }

  componentWillMount() {
    console.log(`Canvas componentWillMount`);
      this.props.flowappFromCanvas(this.state.flowArr);
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
              return <Node key={'node-' + obj.id} node={obj} idFromNode={this.getIDFromNode} />;
            }
            return <Edge key={'edge-' + obj.id} edge={obj} />;
          })}
        </svg>
      </div>
    );
  }
}

export default Canvas;
