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
    this.deleteLastValueInFlowArr = this.deleteLastValueInFlowArr.bind(this);
    this.state = {
      flowArr: [], //Array of all the nodes and edges of the network 
      action: 'none' //System will know if there is a new node action or not
    };
  }
  /**
   * When the new node button clicked, create new node
   */
  newNodeClick(event) {
    let flowArr = this.state.flowArr;
    flowArr = lib.setNode(event.pageX, event.pageY, flowArr); //Send the Coordinates
    this.setState({
      flowArr,
      action: 'node'
    });
    lib.buttonsHandler(true, true, false); //Change the disable attribute on buttons
  }
  /**
   * When the undo button clicked, delete the last object in flowArr
   */
  undoClick() {
    this.deleteLastValueInFlowArr();
    if (this.state.flowArr.length < 3) { //The array must have the 2 default nodes
      document.getElementById('undo').disabled = true;
    }
  }
  /**
   * When the stop button clicked, stop the process of creating new object and delete it from flowArr
   */
  stopClick() {
    this.deleteLastValueInFlowArr();
    this.setState({
      action: 'stop' //Update the state of action
    });
    lib.buttonsHandler(false, false, true); //Change the disable attribute on buttons
    if (this.state.flowArr.length < 3) { //The array must have the 2 default nodes
      document.getElementById('undo').disabled = true;
    }
  }
  /**
   * Delete the last object in flowArr
   */
  deleteLastValueInFlowArr() {
    let flowArr = this.state.flowArr;
    flowArr.pop();
    this.setState({ flowArr });
  }
  /**
   * Receive an updated state: 'action' from Canvas component, and update it in App component
   * @param {string} action indicates if there is a new node action or not
   */
  getActionFromCanvas(action) {
    this.setState({ action });
  }
  /**
   * Receive an updated state: 'flowArr' from Canvas component, and update it in App component
   * @param {Array} flowArr 
   */
  getFlowArrFromCanvas(flowArr) {
    this.setState({ flowArr });
  }
  /**
   * Set the deafult disable attribute on buttons
   */
  componentDidMount() {
    console.log(`App componentDidMount`);
    lib.buttonsHandler(false, true, true);
  }

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
}

export default App;
