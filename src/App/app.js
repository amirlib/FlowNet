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
    this.setState({ action: 'node' });
  }

  undoClick() {
    this.deleteLastValueInFlowArr();
    if (this.state.flowArr.length < 3) {
      document.getElementById('undo').disabled = true;
    }
<<<<<<< HEAD
    /**
     * Set the deafult disable attribute on buttons
     */
    componentDidMount() {
      console.log(`App componentDidMount`);
=======
  }

  stopClick() {
    this.deleteLastValueInFlowArr();
    this.setState({ action: 'stop' });
  }

  deleteLastValueInFlowArr() {
    let flowArr = this.state.flowArr;
    flowArr.pop();
    this.setState({ flowArr });
  }

  getActionFromCanvas(action) {
    if (action === 'none') {
      if (this.state.flowArr.length < 3) {
>>>>>>> Updating
        lib.buttonsHandler(false, true, true);
      } else {
        lib.buttonsHandler(false, false, true);
      }
      this.setState({ action });
    }
  }

<<<<<<< HEAD
    render() {
      console.log(`App render`);
        return (
            <div className='App'>
                <Canvas flowArr={this.state.flowArr} action={this.state.action} getActionFromCanvas={this.getActionFromCanvas} getFlowArrFromCanvas={this.getFlowArrFromCanvas} />
                <div className='menu'>
                    <button id='newNode' onClick={this.newNodeClick}>Node</button>
                    <button id='undo' onClick={this.undoClick}>Undo</button>
                    <button id='stop' onClick={this.stopClick}>Stop</button>
                </div>
            </div>
        );
    }
=======
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
        <Canvas flowArr={this.state.flowArr} action={this.state.action} actionFromCanvas={this.getActionFromCanvas} flowappFromCanvas={this.getFlowArrFromCanvas} />
        <div className='menu'>
          <button id='newNode' onClick={this.newNodeClick}>Node</button>
          <button id='undo' onClick={this.undoClick}>Undo</button>
          <button id='stop' onClick={this.stopClick}>Stop</button>
        </div>
      </div>
    );
  }
>>>>>>> Updating
}

export default App;
