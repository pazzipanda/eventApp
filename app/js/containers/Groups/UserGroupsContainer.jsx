import React, { Component } from 'react';
import { Card, CardText } from 'material-ui/Card';
import UserGroups from '../../components/Groups/UserGroups';

export default class UserGroupsContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.groups.length > 0) {
      return (
        <div>
          <UserGroups groups={ this.props.groups } exitGroup={ this.props.exitGroup } />
        </div>
      );
    }
    return (
      <Card key='noUserGroups' className='card'>
        <CardText>Du bist keiner Gruppe beigetreten.</CardText>
      </Card>
    )
  }
}
