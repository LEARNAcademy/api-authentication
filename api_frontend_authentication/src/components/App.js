import React, { Component } from 'react'
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom'
import Apartments from '../pages/Apartments'
import NewApt from '../pages/NewApt'
import Account from '../pages/Account'
import logo from '../images/logo.svg'
import '../css/App.css';
import withAuth from './withAuth'
import AuthService from '../services/AuthService'  // <- We use the AuthService to logout
import {
  Grid,
  PageHeader,
  Row,
  Button,
  Col
} from 'react-bootstrap'

const Auth = new AuthService() // <- Create a new instance of the Auth service

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: null,
      apiUrl: "http://localhost:3000",
      apartments: [],
      newAptSuccess: false,
      errors: null
    }
  }

  handleLogout(){ // <- Remove local storage, and redirect the user
    Auth.logout()
    this.props.history.replace('/login');
  }

  componentWillMount(){
    const userId = Auth.getUserId()
    console.log(userId)
    debugger
    Auth.fetch(`http://localhost:3000/users/${userId}`).then( res => {
      this.setState({ user: res })
      console.log(this.state.user.id)
    })
  }

  newAptSubmit(apartment){
    fetch(`${this.state.apiUrl}/apartments`,
      {
        body: JSON.stringify({apartment: apartment}),
        headers: {
          'Content-Type': 'application/json'
        },
        method: "POST"
      }
    )
    .then((rawResponse)=>{
      return Promise.all([rawResponse.status, rawResponse.json()])
    })
    .then((parsedResponse)=>{
      if(parsedResponse[0] === 422){
        this.setState({errors: parsedResponse[1]})
      }else{
        const apartments = Object.assign([], this.state.apartments)
        apartments.push(parsedResponse[1])
        this.setState({
          apartments: apartments,
          errors: null,
          newAptSuccess: true
        })
      }
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to the Apartment App</h1>
        </header>

        <Router>
          <div>
            <Route exact path="/apartments" render={props => (
              <Grid>
                <PageHeader>
                  <Row>
                    <Col xs={8}>
                      Apartment App
                      <small className='subtitle'>All the Apartments</small>
                    </Col>
                  </Row>
                </PageHeader>
                <Apartments apartments={this.state.apartments} />
                {!this.state.newAptSuccess &&
                  <Redirect to="/newapt" />
                }
              </Grid>
            )} />

            <Route exact path="/newapt" render={props => (
              <Grid>
                <PageHeader>
                  <Row>
                    <Col xs={8}>
                      Apartment App
                      <small className='subtitle'>Add an Apartment Listing</small>
                    </Col>
                  </Row>
                </PageHeader>
                <NewApt
                  onSubmit={this.newAptSubmit.bind(this)}
                  errors={this.state.errors}
                />
                {this.state.newAptSuccess &&
                  <Redirect to="/apartments" />
                }
              </Grid>
            )} />

            <Route exact path="/myaccount" render={props => (
              <Grid>
                <PageHeader>
                  <Row>
                    <Col xs={8}>
                      Apartment App
                      <small className='subtitle'>My Account Info</small>
                    </Col>
                  </Row>
                </PageHeader>
                <Account />
                }
              </Grid>
            )} />
          </div>
        </Router>

        <p className="App-intro">
          <button type="button" className="form-submit" onClick={this.handleLogout.bind(this)}>Logout</button>
        </p>
      </div>
    )
  }
}

export default withAuth(App)
