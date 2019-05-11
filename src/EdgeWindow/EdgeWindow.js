import React, { Component } from 'react';
import './EdgeWindow.css';

class EdgeWindow extends Component {
	constructor(props) {
    super(props);
    this.createEdge = this.createEdge.bind(this);
  }
  
	createEdge() {
    const edge = {
      from: this.props.data.from,
      to: this.props.data.to,
      capacity: document.getElementById("capacity").value,
      flow: document.getElementById("flow").value,
      action: 'add-edge'
    }

    this.props.edgeFromWindow(edge);
  }

	render() {
		return (
			<div
				className="window-root"
				style={{
					display: this.props.display
				}}>
        <div className="window-edge">
          <div className="edge-header">
            <span>Please insert initial values of capacity and flow for the new edge. The default values are 1 for the capacity and 0 to flow.</span>
          </div>
          <div className="edge-container">
            <div className="edge-cell">
              <label>Capacity</label>
            </div>
            <div className="edge-cell">
              <input type="text" id="capacity" alt="capacity"></input>
            </div>
            <div className="edge-cell">
              <label>Flow</label>
            </div>
            <div className="edge-cell">
              <input type="text" id="flow" alt="flow"></input>
            </div>
          </div>
          <div className="edge-footer">
          <button id="create" onClick={this.createEdge}>Create</button>
          </div>
        </div>
      </div>
		);
	}
}

export default EdgeWindow;
