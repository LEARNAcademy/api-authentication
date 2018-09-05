import React, { Component } from 'react';
import {
  Alert,
  Button,
  Col,
  ControlLabel,
  FormGroup,
  FormControl,
  Row
} from 'react-bootstrap'

class NewUser extends Component {
  constructor(props){
    super(props)
    this.state = {
      apiUrl: "http://localhost:3000",
      newUserSuccess: false,
      form: {
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
      }
    }
  }

  handleSubmit(){
    this.props.onSubmit(this.state.form)
  }

  handleChange(event){
    const formState = Object.assign({}, this.state.form)
    formState[event.target.name] = event.target.value
    this.setState({form: formState})
  }

  errorsFor(attribute){
    var errorString = ""
    if(this.props.errors && this.props.errors[attribute]){
      const errors = this.props.errors[attribute]
      if(errors){
        errorString = errors.join(", ")
      }
    }
    return errorString === "" ? null : errorString
  }

  render(){
    return(
      <form>
        <Row>
          <Col xs={6}>
            {this.props.errors &&
              <Alert bsStyle="danger">
                Please check the form and try again.
              </Alert>
            }
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <FormGroup>
              <ControlLabel id="name">Name</ControlLabel>
              <FormControl
                type="text"
                name="name"
                value={this.state.form.name}
                onChange={this.handleChange.bind(this)}
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col xs={6}>
            <FormGroup>
              <ControlLabel id="email">Email</ControlLabel>
              <FormControl
                type="text"
                name="email"
                value={this.state.form.email}
                onChange={this.handleChange.bind(this)}
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col xs={6}>
            <FormGroup>
              <ControlLabel id="password">Password</ControlLabel>
              <FormControl
                type="text"
                name="password"
                value={this.state.form.password}
                onChange={this.handleChange.bind(this)}
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col xs={6}>
            <FormGroup>
              <ControlLabel id="password_confirmation">Confirm Password</ControlLabel>
              <FormControl
                type="text"
                name="password_confirmation"
                value={this.state.form.password_confirmation}
                onChange={this.handleChange.bind(this)}
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col xs={6}>
            <Button
              id="submit"
              onSubmit={this.handleSubmit.bind(this)}
            >Create New User</Button>
          </Col>
        </Row>
      </form>
    )
  }
}


export default NewUser
