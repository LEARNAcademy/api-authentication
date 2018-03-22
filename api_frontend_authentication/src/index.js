import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './components/App';
import Login from './components/Login';
import Apartment from './pages/Apartment';
import NewApt from './pages/NewApt';

import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route } from 'react-router-dom';

ReactDOM.render(
  <Router>
    <div>
      <Route
        exact
        path='/'
        component={Login}
      />
      <Route
        exact
        path="/info"
        component={App}
      />
      <Route
        exact
        path="/apartments"
        component={Apartment}
      />
      <Route
        exact
        path="/newapt"
        component={NewApt}
      />
    </div>
  </Router>
, document.getElementById('root'));
registerServiceWorker();
