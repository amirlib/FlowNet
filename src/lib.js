import * as final from './final';

/**
 * Return true if there a collision between two nodes, otherwise false
 * @param {Array} flowArr 
 */
export function nodeOnNode(flowArr) {
    let nodeObj = flowArr[flowArr.length - 1];
    for (let i = 0; i < flowArr.length - 1; i++) {
        let math = Math.sqrt((nodeObj.corX - flowArr[i].corX) ** 2 + (nodeObj.corY - flowArr[i].corY) ** 2);
        if (2 * flowArr[i].radius >= math) {
            return true;
        }
    }
    return false;
}
/**
 * Return the ID of node where the mouse is inside. It diffrent from the getIDFromNode method, in that, when the mouse "drag" the edge (in the creating of the edge), it doesn't recognize  * the getIDFromNode method. So there must be some mathematical calculations for recognizing the ID of node.
 * @param {number} corX - The X coordinate of the center of node the mouse is inside
 * @param {number} corY - The Y coordinate of the center of node the mouse is inside
 * @param {Array} flowArr 
 */
export function mouseOnNode(corX, corY, flowArr) {
    for (let i = 0; i < flowArr.length - 1; i++) {
        let math = Math.sqrt((corX - flowArr[i].corX) ** 2 + (corY - flowArr[i].corY) ** 2);
        if (flowArr[i].radius >= math) {
            return i;
        }
    }
    return -1;
}
/**
 * Calculate the X coordinate depending on the width of the screen, and return it. We want that the top left point of the Canvas component will be (0,0)
 * @param {number} mouseCorX - The X coordinate at which the mouse was
 */
export function mouseOnCanvasCorX(mouseCorX) {
    if (document.body.clientWidth > final.mainWidth) {
        return mouseCorX - (document.body.clientWidth - final.mainWidth) / 2;
    }
    return mouseCorX;
}
/**
 * Chanage the disable attribute on buttons
 * @param {boolean} newNode
 * @param {boolean} undo 
 * @param {boolean} stop 
 */
export function buttonsHandler(newNode, undo, stop) {
    document.getElementById('newNode').disabled = newNode;
    document.getElementById('undo').disabled = undo;
    document.getElementById('stop').disabled = stop;
}
/**
 * Search for Matching edges: an existing one, and a new one, that is in progress of creating
 * @param {Array} flowArr 
 * @param {number} endNodeID - The ID of end node 
 */
export function searchSameEdges(flowArr, endNodeID) {
    let edgeObj = flowArr[flowArr.length - 1];
    for (let i = 0; i < flowArr.length - 1; i++) {
        if (flowArr[i].objectType === 'edge' && flowArr[i].startNode === edgeObj.startNode) {
            if (flowArr[i].endNodeID === endNodeID) {
                return true;
            }
        }
    }
    return false;
}
/**
 * Create new edge and saving it information to the array
 * @param {number} corX - The X coordinate of the center of node
 * @param {number} corY  - The Y coordinate of the center of node
 * @param {Array} flowArr 
 */
export function setNode(corX, corY, flowArr) {
    let nodeObj = {
        corX,
        corY,
        radius: final.nodeRadius,
        objectType: 'node'
    };
    flowArr.push(nodeObj);
    return flowArr;
}
