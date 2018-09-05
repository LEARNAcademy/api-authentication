import React, { Component } from 'react';
import NewApt from './NewApt'
import {
  Col,
  ListGroup,
  ListGroupItem,
  Row
} from 'react-bootstrap'

class Apartments extends Component {
  constructor(props) {
    super(props)
    this.state = {
      apiUrl: "http://localhost:3000",
      apartments: [],
      errors: undefined,
    }
  }

  componentWillMount(){
    fetch(`${this.state.apiUrl}/apartments`)
    .then((res)=>{
      return res.json()
    })
    .then((res)=>{
      console.log(res);

      if (res.status != 200) {
        this.setState({
          errors: res,
        })
        return
      }

      this.setState({apartments: res})
    })
  }

  render() {
    const { apartments, errors } = this.state

    if (apartments.length == 0) {
      return <h1>No Apartments Found</h1>
    }

    return (
      <Row>
        <Col xs={12}>
          {errors && JSON.stringify(errors)}
          <ListGroup>
            {apartments.map((apartment, index)=>{
              return(
                <ListGroupItem
                  key={index}
                  header={
                    <h4>
                      <span className='apartment-street'>
                        {apartment.street}
                      </span>
                      - <small className='apartment-city-state'>{apartment.city}, {apartment.state}</small>
                    </h4>
                  }>
                  <span className='apartment-listing-price'>Listing Price: {apartment.listing_price}</span>
                </ListGroupItem>
              )
            })}
          </ListGroup>
        </Col>
      </Row>
    );
  }
}

export default Apartments
