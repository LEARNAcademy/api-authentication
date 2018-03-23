import React, { Component } from 'react';
// import withAuth from '../components/withAuth';
// import AuthService from '../services/AuthService';

// const Auth = new AuthService()

class Account extends Component {
  constructor(props) {
    super(props)
    this.state = {
      apiUrl: "http://localhost3000",
      user: null
    }
  }

  // componentWillMount(){
  //   const userId = Auth.getUserId()
  //   Auth.fetch(`http://localhost:3000/users/${userId}`).then( res => {
  //     this.setState({ user: res })
  //   })
  // }

  render(){
    return(
      <div>
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
      </div>
    )
  }
}

export default Account;
