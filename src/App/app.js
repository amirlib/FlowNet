import gca from 'gca';
import React, { Component } from 'react';
import * as lib from '../lib';
import Canvas from '../Canvas/canvas.js';
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
			action: 'none'
		};
	}

	newNodeClick() {
		lib.buttonsHandler(true, true, false);
		this.setState({ action: 'node' });
	}

	undoClick() {
		this.setState({ action: 'undo' });
	}

	stopClick() {
		this.setState({ action: 'stop' });
	}

	checkButtons(graph) {
		if (graph.countEdges() === 0 && graph.nodesID.length === 2) {
			lib.buttonsHandler(false, true, true);
		} else {
			lib.buttonsHandler(false, false, true);
		}
	}

	updateGraph(object) {
		let graph = this.state.graph.clone();

		switch (object.action) {
			case 'add-node':
				graph.addNode(object.id);
				lib.buttonsHandler(false, false, true);
				break;
			case 'remove-node':
				graph.deleteNode(object.id);
				this.checkButtons(graph);
				break;
			case 'add-edge':
				graph.addEdge(object.from, object.to);
				lib.buttonsHandler(false, false, true);
				break;
			case 'remove-edge':
				graph.deleteEdge(object.from, object.to);
				this.checkButtons(graph);
				break;
			default:
				this.checkButtons(graph);
		}
		this.setState({
			action: 'none',
			graph
		});
	}

	componentDidMount() {
		lib.buttonsHandler(false, true, true);
	}

	render() {
		return (
			<div className="App">
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
