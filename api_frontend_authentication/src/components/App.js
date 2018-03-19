import React, { Component } from 'react'
import logo from '../images/logo.svg'
import '../css/App.css';
import withAuth from './withAuth'
import AuthService from '../services/AuthService'  // <- We use the AuthService to logout

const Auth = new AuthService() // <- Create a new instance of the Auth service

class App extends Component {
  handleLogout(){ // <- Remove local storage, and redirect the user
    Auth.logout()
    this.props.history.replace('/login');
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          <button type="button" className="form-submit" onClick={this.handleLogout.bind(this)}>Logout</button>
        </p>
      </div>
    )
  }
}

export default withAuth(App)
