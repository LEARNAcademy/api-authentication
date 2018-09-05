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

class NewApt extends Component {
  constructor(props){
    super(props)
    this.state = {
      apiUrl: "http://localhost:3000",
      apartments: [],
      newAptSuccess: false,
      form: {
        street: '',
        city: '',
        state: '',
        listing_price: '',
        avatar_base: null
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

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  fileChangeHandler(event){
    const file = event.target.files[0]
    this.getBase64(file).then( (fileString) => {
      const formState = Object.assign({}, this.state.form)
      formState.avatar_base = fileString
      this.setState({form: formState})
    })
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
              <ControlLabel id="street">Address</ControlLabel>
              <FormControl
                type="text"
                name="street"
                value={this.state.form.street}
                onChange={this.handleChange.bind(this)}
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col xs={6}>
            <FormGroup>
              <ControlLabel id="city">City</ControlLabel>
              <FormControl
                type="text"
                name="city"
                value={this.state.form.city}
                onChange={this.handleChange.bind(this)}
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col xs={6}>
            <FormGroup>
              <ControlLabel id="state">State</ControlLabel>
              <FormControl
                type="text"
                name="state"
                value={this.state.form.state}
                onChange={this.handleChange.bind(this)}
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col xs={6}>
            <FormGroup>
              <ControlLabel id="listing_price">Listing Price</ControlLabel>
              <FormControl
                type="text"
                name="listing_price"
                value={this.state.form.listing_price}
                onChange={this.handleChange.bind(this)}
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col xs={6}>
            <FormGroup>
              <ControlLabel id="avatar">Image</ControlLabel>
              <input
                type="file"
                onChange={this.fileChangeHandler.bind(this)}
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col xs={6}>
            <Button
              id="submit"
              onSubmit={this.handleSubmit.bind(this)}
            >Create New Apartment Listing</Button>
          </Col>
        </Row>
      </form>
    )
  }
}


export default NewApt
