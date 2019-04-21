import React, { Component } from 'react';
import * as lib from '../lib'
import Canvas from '../Canvas/canvas.js';
import './app.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.undoClick = this.undoClick.bind(this);
    this.stopClick = this.stopClick.bind(this);
    this.newNodeClick = this.newNodeClick.bind(this);
    this.getActionFromCanvas = this.getActionFromCanvas.bind(this);
    this.getFlowArrFromCanvas = this.getFlowArrFromCanvas.bind(this);
    this.state = {
      flowArr: [], 
      action: 'none'
    };
  }

  newNodeClick() {
    lib.buttonsHandler(true, true, false);
    this.setState({
      action: 'node'
    });
  }

  undoClick() {
    this.deleteLastValueInFlowArr();
    if (this.state.flowArr.length < 3) {
      document.getElementById('undo').disabled = true;
    }
  }

  stopClick() {
    this.deleteLastValueInFlowArr();
    lib.buttonsHandler(false, false, true);
    if (this.state.flowArr.length < 3) {
      document.getElementById('undo').disabled = true;
    }
    this.setState({ action: 'stop' });
  }

  deleteLastValueInFlowArr() {
    let flowArr = this.state.flowArr;
    flowArr.pop();
    this.setState({ flowArr });
  }

  getActionFromCanvas(action) {
    this.setState({ action });
  }

  getFlowArrFromCanvas(flowArr) {
    console.log(`App getFlowArrFromCanvas`);
    this.setState({ flowArr });
  }

  componentDidMount() {
    console.log(`App componentDidMount`);
    lib.buttonsHandler(false, true, true);
  }

  render() {
    console.log(`App render`);
    return (
      <div className='App'>
        <Canvas flowArr={this.state.flowArr} action={this.state.action} actionFromCanvas={this.getActionFromCanvas} flowapFromCanvas={this.getFlowArrFromCanvas} />
        <div className='menu'>
          <button id='newNode' onClick={this.newNodeClick}>Node</button>
          <button id='undo' onClick={this.undoClick}>Undo</button>
          <button id='stop' onClick={this.stopClick}>Stop</button>
        </div>
      </div>
    );
  }
}

export default App;
