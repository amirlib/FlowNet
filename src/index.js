import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App/app';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementsByTagName('MAIN')[0]);
registerServiceWorker();
