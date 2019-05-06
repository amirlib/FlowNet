export function buttonsHandler(newNode, undo, stop) {
	document.getElementById('newNode').disabled = newNode;
	document.getElementById('undo').disabled = undo;
	document.getElementById('stop').disabled = stop;
}
