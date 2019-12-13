import React, { Component } from "react";
import Node from "../Node/node.js";
import Edge from "../Edge/edge.js";
import CanvasStyle from "./canvas.module.css";
import * as final from "../final";

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.canvasMouseMove = this.canvasMouseMove.bind(this);
    this.getIDFromNode = this.getIDFromNode.bind(this);
    this.canvasClick = this.canvasClick.bind(this);
    this.mouseHoverNodeID = undefined; //Which node ID it, while mouse hover on node
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

  setNode(coorX, coorY) {
    let flowArr = Array.from(this.state.flowArr);
    let nodeObj = {
      id: flowArr.length,
      coorX,
      coorY,
      radius: final.nodeRadius,
      type: "node"
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
      type: "edge"
    };

    flowArr.push(edgeObj);
    this.setState({ flowArr });
  }

  identifyClickSituation(x, y) {
    if (
      this.props.status === "creating-node" &&
      this.isNodeOnNode() === false
    ) {
      return "final-node";
    }
    if (this.props.status === "none" && this.mouseHoverNodeID !== undefined) {
      return "starting-edge";
    }
    if (this.props.status === "creating-edge") {
      const toID = this.getIDNodeMouseOn(x, y, this.state.flowArr);

      if (this.isSafeFinalClick(toID)) {
        return "ending-edge";
      }
    }
    return "none";
  }

  isSafeFinalClick(ID) {
    const flowArr = this.state.flowArr;

    if (
      ID === -1 ||
      flowArr[flowArr.length - 1].from.id === ID ||
      this.isSameEdge(ID) === true
    ) {
      return false;
    }
    return true;
  }

  isSameEdge(toID) {
    const flowArr = this.state.flowArr;
    const edge = flowArr[flowArr.length - 1];

    for (let i = 0; i < flowArr.length - 1; i++) {
      if (flowArr[i].type === "edge" && flowArr[i].from.id === edge.from.id) {
        if (flowArr[i].toID === toID) {
          return true;
        }
      }
    }
    return false;
  }

  canvasMouseMove(event) {
    switch (this.props.status) {
      case "creating-node":
      case "creating-edge":
        let flowArr = Array.from(this.state.flowArr);

        flowArr[flowArr.length - 1].coorX = this.getMouseOnCanvasCoorX(
          event.pageX
        );
        flowArr[flowArr.length - 1].coorY = event.pageY - final.headerHeight;
        this.setState({ flowArr });
        break;
      default:
        event.preventDefault();
    }
  }

  canvasClick(event) {
    const situation = this.identifyClickSituation(event.pageX, event.pageY);
    let data = {};

    switch (situation) {
      case "final-node":
        data.id = this.state.flowArr[this.state.flowArr.length - 1].id;
        data.action = "add-node";
        break;
      case "starting-edge":
        data.action = "starting-edge";
        this.setEdge(this.state.flowArr[this.mouseHoverNodeID]);
        break;
      case "ending-edge":
        let flowArr = this.state.flowArr;
        const toID = this.getIDNodeMouseOn(event.pageX, event.pageY, flowArr);

        data.from = flowArr[flowArr.length - 1].from.id;
        data.to = toID;
        data.action = "open-edge-window";
        flowArr[flowArr.length - 1].toID = toID;
        break;
      default:
        event.preventDefault();
        return;
    }
    this.props.flowappFromCanvas(data);
  }

  getIDFromNode(info) {
    this.mouseHoverNodeID = info;
  }

  isNodeOnNode() {
    const flowArr = this.state.flowArr;
    const node = flowArr[flowArr.length - 1];

    for (let i = 0; i < flowArr.length - 1; i++) {
      if (flowArr[i].type === "node") {
        const distance = Math.sqrt(
          (node.coorX - flowArr[i].coorX) ** 2 +
            (node.coorY - flowArr[i].coorY) ** 2
        );

        if (2 * flowArr[i].radius >= distance) {
          return true;
        }
      }
    }
    return false;
  }

  getIDNodeMouseOn(x, y) {
    const flowArr = this.state.flowArr;
    const coorX = this.getMouseOnCanvasCoorX(x);
    const coorY = y - final.headerHeight;

    for (let i = 0; i < flowArr.length - 1; i++) {
      if (flowArr[i].type === "node") {
        const distance = Math.sqrt(
          (coorX - flowArr[i].coorX) ** 2 + (coorY - flowArr[i].coorY) ** 2
        );

        if (flowArr[i].radius >= distance) {
          return i;
        }
      }
    }
    return -1;
  }

  getMouseOnCanvasCoorX(mouseCoorX) {
    if (document.body.clientWidth > final.mainWidth) {
      return (
        mouseCoorX -
        (document.body.clientWidth - final.mainWidth) / 2 -
        final.drawerWidth / 2
      );
    }
    return mouseCoorX;
  }

  deleteLastValueInFlowArr() {
    let flowArr = Array.from(this.state.flowArr);
    let removedObject = {};

    removedObject.action = "none";
    if (flowArr.length > 2) {
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
    }
    return removedObject;
  }

  componentDidUpdate(prevProps) {
    if (this.props.status !== prevProps.status) {
      switch (this.props.status) {
        case "creating-node":
          this.setNode(700, 0);
          break;
        case "undo":
          const removedObject = this.deleteLastValueInFlowArr();

          this.props.flowappFromCanvas(removedObject);
          break;
        case "stop":
          this.mouseHoverNodeID = undefined;
          this.deleteLastValueInFlowArr();
          this.props.flowappFromCanvas("none");
          break;
        default:
      }
    }
  }

  render() {
    return (
      <div
        className={CanvasStyle.root}
        id="canvas-root"
        onMouseMove={this.canvasMouseMove}
        onClick={this.canvasClick}
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
                  idFromNode={this.getIDFromNode}
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
