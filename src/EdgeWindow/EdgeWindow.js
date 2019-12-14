import React, { Component } from "react";
import EdgeWindowStyle from "./EdgeWindow.module.css";

class EdgeWindow extends Component {
  constructor(props) {
    super(props);
    this.parseDataAndSendToApp = this.parseDataAndSendToApp.bind(this);
  }

  parseDataAndSendToApp() {
    let capacity = parseInt(document.getElementById("capacity").value, 10);
    let flow = parseInt(document.getElementById("flow").value, 10);

    if (isNaN(capacity) || capacity < 0) capacity = 1;

    if (isNaN(flow)) flow = 0;

    this.props.sendCapacityAndFlow(capacity, flow);
  }

  render() {
    return (
      <div
        className={EdgeWindowStyle.root}
        style={{
          display: this.props.display
        }}
      >
        <div className={EdgeWindowStyle.window}>
          <div className={EdgeWindowStyle.windowHeader}>
            <span>
              Please insert initial integer values of capacity and flow for the
              new edge. The default values are 1 for the capacity and 0 to flow.
            </span>
          </div>
          <div className={EdgeWindowStyle.windowContainer}>
            <div className={EdgeWindowStyle.windowContainerCell}>
              <label>Capacity</label>
            </div>
            <div className={EdgeWindowStyle.windowContainerCell}>
              <input type="number" id="capacity" alt="capacity"></input>
            </div>
            <div className={EdgeWindowStyle.windowContainerCell}>
              <label>Flow</label>
            </div>
            <div className={EdgeWindowStyle.windowContainerCell}>
              <input type="number" id="flow" alt="flow"></input>
            </div>
          </div>
          <div className={EdgeWindowStyle.windowContainerFooter}>
            <button id="create" onClick={this.parseDataAndSendToApp}>
              Create
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default EdgeWindow;
