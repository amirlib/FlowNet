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

  checkStatusOfUndoButton(graph) {
    if (this.isUndoButtonNeedToBeEnabled(graph)) {
      this.enableUndoButton();
    } else {
      this.disableUndoButton();
    }
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

    this.switchButtonsToDefaultMode();
  }

  disableNewNodeButton() {
    document.getElementById("newNode").disabled = true;
  }

  disableStopButton() {
    document.getElementById("stop").disabled = true;
  }

  disableUndoButton() {
    document.getElementById("undo").disabled = true;
  }

  enableNewNodeButton() {
    document.getElementById("newNode").disabled = false;
  }

  enableStopButton() {
    document.getElementById("stop").disabled = false;
  }

  enableUndoButton() {
    document.getElementById("undo").disabled = false;
  }

  flowClick() {
    alert(this.tool.EdmondsKarp(this.state.graph));
  }

  isUndoButtonNeedToBeEnabled(graph) {
    if (graph.countEdges() !== 0 || graph.nodesID.length !== 2) return true;

    return false;
  }

  newNodeClick() {
    this.switchButtonsToStopMode();
    this.setState({ status: "creating-node" });
  }

  stopClick() {
    this.setState({ status: "stop" });
  }

  switchButtonsToDefaultMode(graph = this.state.graph) {
    this.enableNewNodeButton();
    this.checkStatusOfUndoButton(graph);
    this.disableStopButton();
  }

  switchButtonsToStopMode() {
    this.disableNewNodeButton();
    this.disableUndoButton();
    this.enableStopButton();
  }

  undoClick() {
    this.setState({ status: "undo" });
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
        this.switchButtonsToDefaultMode(graph);
        break;
      case "remove-node":
        graph.deleteNode(object.id);
        status = "none";
        this.switchButtonsToDefaultMode(graph);
        break;
      case "starting-edge":
        status = "creating-edge";
        this.switchButtonsToStopMode();
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
        this.switchButtonsToDefaultMode(graph);
        break;
      case "remove-edge":
        graph.deleteEdge(object.from, object.to);
        status = "none";
        this.switchButtonsToDefaultMode(graph);
        break;
      default:
        status = "none";
        this.switchButtonsToDefaultMode();
    }
    this.setState({
      graph,
      status,
      windowDisplay,
      windowData
    });
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
