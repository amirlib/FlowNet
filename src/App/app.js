import gca from "gca";
import React, { Component } from "react";
import Canvas from "../Canvas/canvas.js";
import EdgeWindow from "../EdgeWindow/EdgeWindow.js";
import AppStyle from "./app.module.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.tool = new gca();
    this.undoClick = this.undoClick.bind(this);
    this.stopClick = this.stopClick.bind(this);
    this.flowClick = this.flowClick.bind(this);
    this.newNodeClick = this.newNodeClick.bind(this);
    this.updateGraph = this.updateGraph.bind(this);
    this.state = {
      graph: this.tool.CreateFlowGraph(),
      status: "none",
      windowDisplay: "none",
      windowData: null
    };
  }

  newNodeClick() {
    this.buttonsHandler(true, true, false);
    this.setState({ status: "creating-node" });
  }

  undoClick() {
    this.setState({ status: "undo" });
  }

  stopClick() {
    this.setState({ status: "stop" });
  }

  flowClick() {
    alert(this.tool.EdmondsKarp(this.state.graph));
  }

  buttonsHandler(newNode, undo, stop) {
    document.getElementById("newNode").disabled = newNode;
    document.getElementById("undo").disabled = undo;
    document.getElementById("stop").disabled = stop;
  }

  isUndoNeedBeDisabled(graph) {
    if (graph.countEdges() === 0 && graph.nodesID.length === 2) {
      this.buttonsHandler(false, true, true);
    } else {
      this.buttonsHandler(false, false, true);
    }
  }

  updateGraph(object) {
    let graph = this.state.graph.clone();
    let status = this.state.status;
    let windowDisplay = this.state.windowDisplay;
    let windowData = this.state.windowData;

    switch (object.action) {
      case "add-node":
        graph.addNode(object.id);
        status = "none";
        this.buttonsHandler(false, false, true);
        break;
      case "remove-node":
        graph.deleteNode(object.id);
        status = "none";
        this.isUndoNeedBeDisabled(graph);
        break;
      case "starting-edge":
        status = "creating-edge";
        this.buttonsHandler(true, true, false);
        break;
      case "open-edge-window":
        windowDisplay = "flex";
        windowData = {
          from: object.from,
          to: object.to
        };
        break;
      case "add-edge":
        graph.addEdge(object.from, object.to, object.capacity, object.flow);
        status = "none";
        windowDisplay = "none";
        this.buttonsHandler(false, false, true);
        break;
      case "remove-edge":
        graph.deleteEdge(object.from, object.to);
        status = "none";
        this.isUndoNeedBeDisabled(graph);
        break;
      default:
        status = "none";
        this.isUndoNeedBeDisabled(graph);
    }
    this.setState({
      graph,
      status,
      windowDisplay,
      windowData
    });
  }

  componentDidMount() {
    const mainElement = document.querySelector("main");
    const menuElement = document.getElementById("header-menu");
    const toolsElement = document.getElementById("app-tools");

    menuElement.addEventListener("click", function(e) {
      toolsElement.classList.toggle(`${AppStyle.open}`);
      e.stopPropagation();
    });

    mainElement.addEventListener("click", function() {
      toolsElement.classList.remove(`${AppStyle.open}`);
    });
    this.buttonsHandler(false, true, true);
  }

  render() {
    return (
      <div className={AppStyle.root}>
        <div id="app-tools" className={AppStyle.tools}>
          <button
            id="maxFlow"
            className={AppStyle.tool}
            onClick={this.flowClick}
          >
            Edmond's Karp
          </button>
        </div>
        <EdgeWindow
          display={this.state.windowDisplay}
          data={this.state.windowData}
          edgeFromWindow={this.updateGraph}
        />
        <Canvas
          status={this.state.status}
          flowappFromCanvas={this.updateGraph}
        />
        <div className={AppStyle.menu}>
          <button id="newNode" onClick={this.newNodeClick}>
            Node
          </button>
          <button id="undo" onClick={this.undoClick}>
            Undo
          </button>
          <button id="stop" onClick={this.stopClick}>
            Stop
          </button>
        </div>
      </div>
    );
  }
}

export default App;
