import React, { Component } from "react";
import Node from "../Node/node.js";
import Edge from "../Edge/edge.js";
import CanvasStyle from "./canvas.module.css";
import * as final from "../final";

class Canvas extends Component {
  constructor(props) {
    super(props);

    this.handleCanvasClick = this.handleCanvasClick.bind(this);
    this.canvasMouseMove = this.canvasMouseMove.bind(this);
    this.getIdFromNode = this.getIdFromNode.bind(this);
    this.mouseHoverOnNodeId = undefined; //Which node ID it, while mouse hover on node
    this.state = {
      flowArr: [
        {
          id: 0,
          coorX: 50,
          coorY: 350,
          radius: final.nodeRadius,
          type: "node"
        },
        {
          id: 1,
          coorX: 650,
          coorY: 350,
          radius: final.nodeRadius,
          type: "node"
        }
      ]
    };
  }

  calculateDistance(x, y) {
    return Math.sqrt(x ** 2 + y ** 2);
  }

  calculateMouseCoorXOnCanvas(mouseCoorX) {
    if (document.body.clientWidth <= final.mainWidth) return mouseCoorX;

    const widthOfWhiteScreen =
      document.body.clientWidth - final.mainWidth + final.drawerWidth;

    return mouseCoorX - widthOfWhiteScreen / 2;
  }

  canvasMouseMove(event) {
    switch (this.props.status) {
      case "creating-node":
      case "creating-edge":
        this.updateCoordinatesOfLastFlowArrObject(event.pageX, event.pageY);
        break;
      default:
        event.preventDefault();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.status === prevProps.status) return;

    switch (this.props.status) {
      case "creating-node":
        this.setNode(700, 0);
        break;
      case "undo":
        const removedObject = this.deleteLastObjectInFlowArr();

        this.props.flowappFromCanvas(removedObject);
        break;
      case "stop":
        this.mouseHoverOnNodeId = undefined;
        this.deleteLastObjectInFlowArr();
        this.props.flowappFromCanvas("none");
        break;
      default:
    }
  }

  createDataOfNewEdgeAndSendToApp() {
    const data = { action: "starting-edge" };

    this.setEdge(this.state.flowArr[this.mouseHoverOnNodeId]);
    this.props.flowappFromCanvas(data);
  }

  createDataOfNewNodeAndSendToApp() {
    const data = {
      id: this.state.flowArr[this.state.flowArr.length - 1].id,
      action: "add-node"
    };

    this.props.flowappFromCanvas(data);
  }

  deleteLastObjectInFlowArr() {
    const flowArr = Array.from(this.state.flowArr);
    const removedObject = { action: "none" };

    if (flowArr.length <= 2) return removedObject;

    const lastObject = flowArr.pop();

    switch (lastObject.type) {
      case "node":
        removedObject.id = lastObject.id;
        removedObject.action = "remove-node";
        break;
      case "edge":
        removedObject.from = lastObject.from.id;
        removedObject.to = lastObject.toID;
        removedObject.action = "remove-edge";
        break;
      default:
    }

    this.setState({ flowArr });
    return removedObject;
  }

  getIdFromNode(info) {
    this.mouseHoverOnNodeId = info;
  }

  getNodeIdWhenMouseOn(x, y) {
    const flowArr = this.state.flowArr;
    const coorX = this.calculateMouseCoorXOnCanvas(x);
    const coorY = y - final.headerHeight;

    for (let i = 0; i < flowArr.length - 1; i++) {
      if (flowArr[i].type !== "node") continue;

      const xDistance = coorX - flowArr[i].coorX;
      const yDistance = coorY - flowArr[i].coorY;
      const distance = this.calculateDistance(xDistance, yDistance);

      if (flowArr[i].radius >= distance) return i;
    }

    return -1;
  }

  handleCanvasClick(event) {
    const mode = this.identifyClickMode(event.pageX, event.pageY);

    switch (mode) {
      case "final-node":
        this.createDataOfNewNodeAndSendToApp();
        break;
      case "starting-edge":
        this.createDataOfNewEdgeAndSendToApp();
        break;
      case "ending-edge":
        this.updateDataOfNewEdgeAndSendToApp(event.pageX, event.pageY);
        break;
      default:
        event.preventDefault();
    }
  }

  identifyClickMode(x, y) {
    if (this.props.status === "creating-node" && !this.isNodeOnAnotherNode())
      return "final-node";

    if (this.props.status === "none" && this.mouseHoverOnNodeId !== undefined)
      return "starting-edge";

    if (this.props.status === "creating-edge") {
      const to = this.getNodeIdWhenMouseOn(x, y, this.state.flowArr);

      if (this.isClickIsEndingEdge(to)) return "ending-edge";
    }

    return "none";
  }

  isClickIsEndingEdge(id) {
    const flowArr = this.state.flowArr;

    if (id === -1) return false;
    if (flowArr[flowArr.length - 1].from.id === id) return false;
    if (this.isEdgeExists(id)) return false;

    return true;
  }

  isEdgeExists(toId) {
    const edge = this.state.flowArr[this.state.flowArr.length - 1];
    const iterator = this.state.flowArr.values();

    for (const obj of iterator) {
      if (obj.type !== "edge") continue;
      if (obj.from.id !== edge.from.id) continue;
      if (obj.toID !== toId) continue;

      return true;
    }

    return false;
  }

  isNodeOnAnotherNode() {
    const newNode = this.state.flowArr[this.state.flowArr.length - 1];
    const nodes = this.state.flowArr.filter(
      obj => obj.type === "node" && obj !== newNode
    );
    const iterator = nodes.values();

    for (const obj of iterator) {
      const x = newNode.coorX - obj.coorX;
      const y = newNode.coorY - obj.coorY;
      const distance = this.calculateDistance(x, y);

      if (2 * obj.radius >= distance) return true;
    }

    return false;
  }

  setEdge(from) {
    const flowArr = Array.from(this.state.flowArr);
    const edge = {
      id: flowArr.length,
      from,
      coorX: from.coorX,
      coorY: from.coorY,
      toID: from.id,
      type: "edge"
    };

    flowArr.push(edge);
    this.setState({ flowArr });
  }

  setNode(coorX, coorY) {
    const flowArr = Array.from(this.state.flowArr);
    const node = {
      id: flowArr.length,
      coorX,
      coorY,
      radius: final.nodeRadius,
      type: "node"
    };

    flowArr.push(node);
    this.setState({ flowArr });
  }

  updateCoordinatesOfLastFlowArrObject(pageX, pageY) {
    const flowArr = Array.from(this.state.flowArr);
    const obj = flowArr[flowArr.length - 1];

    obj.coorX = this.calculateMouseCoorXOnCanvas(pageX);
    obj.coorY = pageY - final.headerHeight;
    this.setState({ flowArr });
  }

  updateDataOfNewEdgeAndSendToApp(pageX, pageY) {
    const flowArr = this.state.flowArr;
    const toID = this.getNodeIdWhenMouseOn(pageX, pageY, flowArr);
    const data = {
      from: flowArr[flowArr.length - 1].from.id,
      to: toID,
      action: "open-edge-window"
    };

    flowArr[flowArr.length - 1].toID = toID;
    this.props.flowappFromCanvas(data);
  }

  render() {
    return (
      <div
        className={CanvasStyle.root}
        id="canvas-root"
        onMouseMove={this.canvasMouseMove}
        onClick={this.handleCanvasClick}
      >
        <svg height="700" width="700">
          <defs>
            <marker
              id="arrow"
              markerWidth="13"
              markerHeight="13"
              refX="0.1"
              refY="6"
              orient="auto"
            >
              <path d="M2,2 L2,13 L8,7 L2,2" style={{ fill: "red" }} />
            </marker>
          </defs>
          {this.state.flowArr.map(obj => {
            if (obj.type === "node") {
              return (
                <Node
                  key={"node-" + obj.id}
                  node={obj}
                  idFromNode={this.getIdFromNode}
                />
              );
            }

            return <Edge key={"edge-" + obj.id} edge={obj} />;
          })}
        </svg>
      </div>
    );
  }
}

export default Canvas;
