import React, { Component } from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

const UserGroups = ({ exitGroup, groups }) => (
  <div className='groups'>
    {groups.map(group => (
      <Card key={ group._id } className='card'>
        <CardTitle title={ group.name } />
        <CardText style={ { fontWeight: '400' } }>{ group.description }</CardText>
        <IconButton onTouchTap={ () => exitGroup(group._id) } >
          <FontIcon className='material-icons'>remove_circle</FontIcon>
        </IconButton>
      </Card>
    ))}
  </div>
);

export default UserGroups;
