import React, { Component } from 'react';
import { Card, CardText } from 'material-ui/Card';
import UserEventList from '../../components/Events/UserEvents';

export default class UserEventListContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.events.length > 0) {
      return (
        <UserEventList events={ this.props.events } cancelEvent={ this.props.cancelEvent } />
      );
    }
    return (
      <Card key='noUserEvents' className='card'>
        <CardText>Du nimmst an keinen Events teil.</CardText>
      </Card>
    )
  }
}
