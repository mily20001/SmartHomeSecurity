import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MainGrid from './MainGrid';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<MainGrid />, document.getElementById('root'));
registerServiceWorker();
