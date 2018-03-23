import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './components/App';
import Login from './pages/Login';
import NewUser from './pages/NewUser';
import Apartments from './pages/Apartments';
import NewApt from './pages/NewApt';

import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route } from 'react-router-dom';

ReactDOM.render(
  <Router>
    <div>
      <Route
        exact
        path='/'
        component={App}
      />
      <Route
        exact
        path="/login"
        component={Login}
      />
      <Route
        exact
        path="/registration"
        component={NewUser}
      />
      <Route
        exact
        path="/apartments"
        component={Apartments}
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
