# Authentication Front end Example
Authentication in a React application that interacts with a backend api requires us to request a secure token, and then pass that token along with every request to the api that requires it to perform actions on behalf of the user using the application.  The React app must request that token for the first time by submitting login credentials.  In the following example, we'll be using email and password.  There are many other types of credentials that can be used and often a web application will use multiple types.  Oauth is used to allow popular apps like Twitter and Facebook provide login services.  You may also run across single sign in systems in large organizations that allow users to login to one main system, and then gain access to your app among many others.  All of these systems share common functionality.  A user must prove who they are, and then receive a token in return that they can use to make additional requests.

## Create a new React Application
Our app is going to use 'create-react-app' with the packages 'jwt-decode', and 'react-router-dom'.  Let's get started:

```
$ create-react-app app_frontend_authentication
$ cd app_frontend_authentication
$ yarn add jwt-decode react-router-dom
```

### Organize some files
Next, we'll organize some files so we can keep things tidy.  We create 'src/components', 'src/css', and 'src/images' and move the corresponding files to their appropriate places.  Our app looks like this at this point:

![app structure](https://s3.amazonaws.com/learn-site/curriculum/React/api-frontend-auth-organization.png)

Notice that we update the paths in our import statements to the new locations of our files.  We start the application up, and confirm that everything continues to work as before.

## Add the React Router
In 'src/index.js', we add the React Router.  First we import the 'Router' and 'Route' from react-router-dom

#### src/index.js
```
import { BrowserRouter as Router, Route } from 'react-router-dom';
```

Next, we add a default route to the App component, so our application will continue to work as before.

```javascript
ReactDOM.render(
  <Router>
    <div>
      <Route 
        exact
        path='/' 
        component={App} 
      />
    </div>
  </Router>
, document.getElementById('root'));
registerServiceWorker();
```

Loading the app again, things continue to work as before.

## Login Component
We're going to need a place for users to enter their email and password during login.  This is a form like the many others that we've built.Here is a good start for our component and associated CSS file:

#### src/components/Login.js
```javascript
import React, { Component } from 'react';
import '../css/Login.css';

class Login extends Component {
  constructor(){
    super()
    this.state={
      email: '',
      password: ''
    }
  }

  handleChange(e){
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    return (
      <div className="center">
        <div className="card">
          <h1>Login</h1>
          <form>
            <input
              className="form-item"
              placeholder="email goes here..."
              name="email"
              type="text"
              onChange={this.handleChange.bind(this)}
              value={this.state.email}
            />
            <input
              className="form-item"
              placeholder="Password goes here..."
              name="password"
              type="password"
              onChange={this.handleChange.bind(this)}
              value={this.state.password}
            />
            <input
              className="form-submit"
              value="SUBMIT"
              type="submit"
            />
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
```

#### src/css/Login.css
```css
.center{
  background-color: #7ac143;
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card{
  background-color: #fff;
  border-radius: 15px;
  padding: 0.8rem;
}

.card > form{
  display: flex;
  flex-direction: column;
}

.card h1{
  text-align: center;
  margin-top: 0;
  margin-bottom: 10px;
}

.form-item{
  padding: 5px;
  margin-bottom: 2rem;
  height: 30px;
  width: 16rem;
  border: 1px solid grey;
}

.form-submit{
  height: 35px;
  color: #fff;
  background-color: #7ac143;
  border: none;
  transition: 0.3s opacity ease;
  cursor: pointer;
}
.form-submit:hover{
  opacity: 0.6;
}
```

And we can add Login to the router:

#### src/index.js
Import the component:
```javascript
import Login from './components/Login';
```

And add the route:
```javascript
<Route
  exact
  path="/login"
  component={Login}
/>
```

Now, when we navigate the browser to ```http://localhost:3001/login```, we see:

![login screen](https://s3.amazonaws.com/learn-site/curriculum/React/auth-login.png)

## Auth Service
We're ready to create an authenitcation service that talks to the backend and stores the JWT.  Here is the complete file:

### src/services/AuthService.js
```javascript
import decode from 'jwt-decode';

export default class AuthService {
    constructor(domain) {
        this.domain = domain || 'http://localhost:3003' // We can pass in the backend server, or use a default for dev
        this.fetch = this.fetch.bind(this)
        this.login = this.login.bind(this)
        this.getUserId = this.getUserId.bind(this)
    }

    login(email, password) {
      return this.fetch(`${this.domain}/users/sign_in`, { // Our backend endpoint
        method: 'POST',
        body: JSON.stringify({
          user: { // We pass in email and password from the login form
            email,
            password
          }
        })
      })
    }

    loggedIn() { // A check to see if user is logged in
      const token = this._getTokenFromLocalStorage()
      return !!token && !this.isTokenExpired(token)
    }

    // Tokens are only valid for a certain period of time, determined by the server.
    // When the one used by the React application, another one needs to be fetched.
    isTokenExpired(token) {
      try {
        const decoded = decode(token);
        if (decoded.exp < Date.now() / 1000) {
          return true;
        }
        else
          return false;
      }
      catch (err) {
        return false;
      }
    }

    // Removes the token
    logout() {
      localStorage.removeItem('id_token');
    }

    // We can decode the token and find the user's ID for subsequent calls to the server
    getUserId() {
      const token = decode(this._getTokenFromLocalStorage());
      return token.sub
    }

    // Enhance the standard version of fetch() by
    // adding the authentication headers into every request
    fetch(url, options) {
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }

      if (this.loggedIn()) {
        headers['Authorization'] = this._getTokenFromLocalStorage()
      }

      return fetch(url, {
        headers,
        ...options
      })
      .then(this._checkStatus.bind(this))
      .then(this._captureToken.bind(this))
      .then(response => response.json())
    }

    _checkStatus(response) {
      if (response.status >= 200 && response.status < 300) {
        return response
      } else {
        var error = new Error(response.statusText)
        error.response = response
        throw error
      }
    }

    _captureToken(response){  
      var header = response.headers.get("Authorization")
      if(header){
        this._setTokenInLocalStorage(response.headers.get("Authorization"))
      }
      return response
    }

    // The token is stored in the browser
    _setTokenInLocalStorage(idToken) {
      localStorage.setItem('id_token', idToken)
    }

    // Fetch the token from local storage
    _getTokenFromLocalStorage() {
      return localStorage.getItem('id_token')
    }
}

```

Let's use the new authentication service to submit login credentials when users submit the Login form:

#### src/components/Login.js
Add an import statement for the AuthService, and a function to handle when the form is submitted.  Here is the completed component:
```javascript
import React, { Component } from 'react';
import '../css/Login.css';
import AuthService from '../services/AuthService';

class Login extends Component {
  constructor(){
    super()
    this.Auth = new AuthService()
    this.state={
      email: '',
      password: ''
    }
  }

  handleChange(e){
    this.setState({ [e.target.name]: e.target.value })
  }

  handleFormSubmit(e){
    e.preventDefault()
    this.Auth.login(this.state.email,this.state.password)
    .then(res =>{ 
      this.props.history.replace('/') 
    })
    .catch(err =>{ alert(err) })
  }

  render() {
    return (
      <div className="center">
        <div className="card">
          <h1>Login</h1>
          <form 
            onSubmit={this.handleFormSubmit.bind(this)}
          >
            <input
              className="form-item"
              placeholder="email goes here..."
              name="email"
              type="text"
              onChange={this.handleChange.bind(this)}
              value={this.state.email}
            />
            <input
              className="form-item"
              placeholder="Password goes here..."
              name="password"
              type="password"
              onChange={this.handleChange.bind(this)}
              value={this.state.password}
            />
            <input
              className="form-submit"
              value="SUBMIT"
              type="submit"
            />
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
```

At this point, we start the backend server on localhost:3000, and verify that Login is working as we want.  We can submit a valid email and password combination to login and be redirected to the homepage.  When we put in bad credentials, a message is shown indicating that login failed.

## Protecting Authenticated Routes
Our app is coming together now, but one big missing piece is left to do.  We need to protect routes that show personalized user information.  If a user isn't logged in, they can't be allowed to view pages that contain user information.  Instead, we want to redirect them back to the login page so they can authenticate and afterwards, access the information they are after.  For this, we are going to use a higher order function.  This means that we're going to build a function that returns another function which either renders the protected component for logged in users, or redirects to login for unknown users.  Let's take a look at the completed function, and then we'll break it down:

#### src/components/withAuth.js
```javascript
import React, { Component } from 'react'
import AuthService from '../services/AuthService'

export default function withAuth(WrappedComponent) {
  const Auth = new AuthService()
  return class AuthWrapped extends Component {
    constructor() {
      super();
      this.state = {
        userId: null
      }
    }

    componentWillMount() {
      if (!Auth.loggedIn()) {
        this.props.history.replace('/login')
      }
      else {
        try {
          const userId = Auth.getUserId()
          this.setState({
            userId: userId
          })
        }
        catch(err){
          Auth.logout()
          this.props.history.replace('/login')
        }
      }
    }

    render() {
      if (this.state.userId) {
        return (
          <WrappedComponent history={this.props.history} userId={this.state.userId} />
        )
      }
      else {
        return null
      }
    }
  }
}
```

The first two lines import what we'll need to check auth and render a component.
```javasript
import React, { Component } from 'react'
import AuthService from '../services/AuthService'
```

Next, we export our higher order function.  We pass in the component that we want to protect from authenticated use.  We then define a new React component that we'll return from the function.  This component will perform our authentication check and act accordingly:
```javascript
export default function withAuth(WrappedComponent) {
  const Auth = new AuthService()
  return class AuthWrapped extends Component {
    constructor() {
      super();
      this.state = { // If the user is logged in, we'll set the userId in state
        userId: null
      }
    }
    ...
  }
}
```

This component will be mounted by the browser when the user navigates to the associated route.  We'll set all of this up in the router in the next step.  ```componentWillMount()``` will be called when the router attemps to render the page for that route, which is the perfect place for us to put our authorization check:

```javascript
componentWillMount() {
  if (!Auth.loggedIn()) { // User is unauthenticated, so we redirect
    this.props.history.replace('/login')
  }
  else {
    try { // User is logged in, we can assign the ID
      const userId = Auth.getUserId()
      this.setState({
        userId: userId
      })
    }
    catch(err){
      Auth.logout() // Something has gone wrong,  allow user to login and start over
      this.props.history.replace('/login')
    }
  }
}
```

Finally, we either render our authenticated component if the user is logged in or render nothing, and let the redirect take care of the rest:

```javascript
render() {
  if (this.state.userId) {
    return (
      <WrappedComponent history={this.props.history} userId={this.state.userId} />
    )
  }
  else {
    return null
  }
}
```

That's it for our authenticated check.  We're ready to use it.  Opening up the App component, we can replace our export statement to export the App component wrapped in our higher order function instead:

#### src/components/App.js
We import ```withAuth``` at the top of the file

```javascript
import withAuth from './withAuth'
```

Then on the last line of the file, we export the wrapped component instead:

```javascript
export default withAuth(App)
```

## Adding a Logout Button
Last thing to do is to add a logout button to clear local storage of the JWT, reverting the user to an unknown state.  That happens in the App component as well.  Here is the complete App component:

#### src/components/App.js
```javascript
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
```

Its time to try it out!  At this point, we can login and log out of the application.

## Challenges
We've seen how to log in and log out of a React application.  Our back end also supports registration.  Your task is to add a registration route and component, allowing the user to register, recieve a token, and commit that to local storage.

### Story
As a new user, I want to submit registration so that I can use parts of the application that require authentication.

