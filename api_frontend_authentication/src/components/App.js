import React, { Component } from 'react'
import logo from '../images/logo.svg'
import '../css/App.css';
import withAuth from './withAuth'
import AuthService from '../services/AuthService'  // <- We use the AuthService to logout

const Auth = new AuthService() // <- Create a new instance of the Auth service

class App extends Component {
  constructor(props){
    super()
    this.state = {user: null}
  }

  handleLogout(){ // <- Remove local storage, and redirect the user
    Auth.logout()
    this.props.history.replace('/login');
  }

  componentWillMount(){
    const userId = Auth.getUserId()
    Auth.fetch(`http://localhost:3000/users/${userId}`).then( res => {
      this.setState({ user: res })
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        {this.state.user &&
          <div>
            <h2>Your Account</h2>
            <div>Name: {this.state.user.name}</div>
            <div>Email: {this.state.user.email}</div>

            <h3>Your Roles</h3>
            <ul>
              {this.state.user.roles.map( role => {
                return(
                  <li key={role.name}>{role.name}</li>
                )
              })}
            </ul>
          </div>
        }
        <p className="App-intro">
          <button type="button" className="form-submit" onClick={this.handleLogout.bind(this)}>Logout</button>
        </p>
      </div>
    )
  }
}

export default withAuth(App)
