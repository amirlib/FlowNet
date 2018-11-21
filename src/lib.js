import * as final from './final';

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

export function mouseOnNode(corX, corY, flowArr) {
    for (let i = 0; i < flowArr.length - 1; i++) {
        let math = Math.sqrt((corX - flowArr[i].corX) ** 2 + (corY - flowArr[i].corY) ** 2);
        if (flowArr[i].radius >= math) {
            return i;
        }
    }
    return -1;
}

export function mouseOnCanvasCorX(mouseCorX) {
    if (document.body.clientWidth > final.mainWidth) {
        return mouseCorX - (document.body.clientWidth - final.mainWidth) / 2;
    }
    return mouseCorX;
}

export function buttonsHandler(newNode, undo, stop) {
    document.getElementById('newNode').disabled = newNode;
    document.getElementById('undo').disabled = undo;
    document.getElementById('stop').disabled = stop;
}

export function searchSameEdges(flowArr, nodeInID) {
    let edgeObj = flowArr[flowArr.length - 1];
    for (let i = 0; i < flowArr.length - 1; i++) {
        if (flowArr[i].objectType === 'edge' && flowArr[i].nodeOut === edgeObj.nodeOut) {
            if (flowArr[i].nodeInID === nodeInID) {
                return true;
            }
        }
    }
    return false;
}

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
