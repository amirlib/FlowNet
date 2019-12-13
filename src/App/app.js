import gca from "gca";
import React, { Component } from "react";
import Canvas from "../Canvas/canvas.js";
import EdgeWindow from "../EdgeWindow/EdgeWindow.js";
import AppStyle from "./app.module.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.tool = new gca();
    this.flowClick = this.flowClick.bind(this);
    this.newNodeClick = this.newNodeClick.bind(this);
    this.stopClick = this.stopClick.bind(this);
    this.undoClick = this.undoClick.bind(this);
    this.updateGraph = this.updateGraph.bind(this);
    this.state = {
      graph: this.tool.CreateFlowGraph(),
      status: "none",
      windowDisplay: "none",
      windowData: null
    };
  }

  addEdgeStatus(from, to, capacity, flow) {
    const graph = this.state.graph.clone();

    graph.addEdge(from, to, capacity, flow);
    this.switchToNoneStatusAndSetStates(graph, "none");
  }

  addNodeStatus(id) {
    const graph = this.state.graph.clone();

    graph.addNode(id);
    this.switchToNoneStatusAndSetStates(graph);
  }

  changeButtonDisabledPropertyValue(name, value) {
    document.getElementById(name).disabled = value;
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

  disableButton(name) {
    this.changeButtonDisabledPropertyValue(name, true);
  }

  disableNewNodeButton() {
    this.disableButton("newNode");
  }

  disableStopButton() {
    this.disableButton("stop");
  }

  disableUndoButton() {
    this.disableButton("undo");
  }

  enableButton(name) {
    this.changeButtonDisabledPropertyValue(name, false);
  }

  enableNewNodeButton() {
    this.enableButton("newNode");
  }

  enableStopButton() {
    this.enableButton("stop");
  }

  enableUndoButton() {
    this.enableButton("undo");
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

  openEdgeWindowStatus(object) {
    this.setState({
      windowDisplay: "flex",
      windowData: {
        from: object.from,
        to: object.to
      }
    });
  }

  removeEdgeStatus(from, to) {
    const graph = this.state.graph.clone();

    graph.deleteEdge(from, to);
    this.switchToNoneStatusAndSetStates(graph);
  }

  removeNodeStatus(id) {
    const graph = this.state.graph.clone();

    graph.deleteNode(id);
    this.switchToNoneStatusAndSetStates(graph);
  }

  startingEdgeStatus() {
    this.switchButtonsToStopMode();
    this.setState({ status: "creating-edge" });
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

  switchToNoneStatusAndSetStates(
    graph,
    windowDisplay = this.state.windowDisplay
  ) {
    this.switchButtonsToDefaultMode(graph);
    this.setState({
      graph,
      status: "none",
      windowDisplay
    });
  }

  undoClick() {
    this.setState({ status: "undo" });
  }

  updateGraph(object) {
    switch (object.action) {
      case "add-edge":
        this.addEdgeStatus(
          object.from,
          object.to,
          object.capacity,
          object.flow
        );
        break;
      case "add-node":
        this.addNodeStatus(object.id);
        break;
      case "open-edge-window":
        this.openEdgeWindowStatus(object);
        break;
      case "remove-edge":
        this.removeEdgeStatus(object.from, object.to);
        break;
      case "remove-node":
        this.removeNodeStatus(object.id);
        break;
      case "starting-edge":
        this.startingEdgeStatus();
        break;
      default:
        this.switchButtonsToDefaultMode();
        this.setState({ status: "none" });
    }
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
