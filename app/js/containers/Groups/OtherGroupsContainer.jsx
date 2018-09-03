import React, { Component } from 'react';
import { Card, CardText } from 'material-ui/Card';
import OtherGroups from '../../components/Groups/OtherGroups';

export default class OtherGroupsContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.groups.length > 0) {
      return (
        <OtherGroups groups={ this.props.groups } enterGroup={ this.props.enterGroup } />
      );
    }
    return (
      <Card key='noUserGroups' className='card'>
        <CardText>Es gibt keine weiteren Gruppen.</CardText>
      </Card>
    )
  }
}
