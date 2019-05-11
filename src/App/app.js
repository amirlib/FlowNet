import gca from 'gca';
import React, { Component } from 'react';
import Canvas from '../Canvas/canvas.js';
import EdgeWindow from '../EdgeWindow/EdgeWindow.js';
import './app.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.tool = new gca();
		this.undoClick = this.undoClick.bind(this);
		this.stopClick = this.stopClick.bind(this);
		this.newNodeClick = this.newNodeClick.bind(this);
    this.updateGraph = this.updateGraph.bind(this);
		this.state = {
			graph: this.tool.CreateFlowGraph(),
      action: 'none',
      windowDisplay: 'none',
      windowData: null
		};
	}

	newNodeClick() {
		this.buttonsHandler(true, true, false);
		this.setState({ action: 'node' });
	}

	undoClick() {
		this.setState({ action: 'undo' });
	}

	stopClick() {
		this.setState({ action: 'stop' });
  }
  
  buttonsHandler(newNode, undo, stop) {
    document.getElementById('newNode').disabled = newNode;
    document.getElementById('undo').disabled = undo;
    document.getElementById('stop').disabled = stop;
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
    let action = this.state.action;
    let windowDisplay = this.state.windowDisplay;
    let windowData = this.state.windowData;

		switch (object.action) {
			case 'add-node':
				graph.addNode(object.id);
        this.buttonsHandler(false, false, true);
        action = 'none';
				break;
			case 'remove-node':
				graph.deleteNode(object.id);
        this.isUndoNeedBeDisabled(graph);
        action = 'none';
        break;
      case 'starting-edge':
        this.buttonsHandler(true, true, false);
        break;
      case 'open-edge-window':
        windowDisplay = 'flex';
        windowData = {
          from: object.from,
          to: object.to
        };
        break;
      case 'add-edge':
        this.buttonsHandler(false, false, true);
        graph.addEdge(object.from, object.to, object.capacity, object.flow);
        windowDisplay = 'none';
        break;
			case 'remove-edge':
				graph.deleteEdge(object.from, object.to);
        this.isUndoNeedBeDisabled(graph);
        action = 'none';
				break;
			default:
        this.isUndoNeedBeDisabled(graph);
        action = 'none';
    }
		this.setState({
			action,
      graph,
      windowDisplay,
      windowData
		});
  }

	componentDidMount() {
		this.buttonsHandler(false, true, true);
	}

	render() {
		return (
			<div className="App">
        <EdgeWindow
          display={this.state.windowDisplay}
          data={this.state.windowData}
          edgeFromWindow={this.updateGraph}/>
				<Canvas
					action={this.state.action}
					flowappFromCanvas={this.updateGraph}/>
				<div className="menu">
					<button id="newNode" onClick={this.newNodeClick}>Node</button>
					<button id="undo" onClick={this.undoClick}>Undo</button>
					<button id="stop" onClick={this.stopClick}>Stop</button>
				</div>
			</div>
		);
	}
}

export default App;
