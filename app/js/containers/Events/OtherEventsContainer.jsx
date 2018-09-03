import React, { Component } from 'react';
import { Card, CardText } from 'material-ui/Card';
import OtherEventList from '../../components/Events/OtherEvents';

export default class OtherEventListContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.events.length > 0) {
      return (
        <OtherEventList events={ this.props.events } attendEvent={ this.props.attendEvent } />
      );
    }
    return (
      <Card key='noOtherEvents' className='card'>
        <CardText>Es gibt keine weiteren Events in deinen Gruppen.</CardText>
      </Card>
    )
  }
}
