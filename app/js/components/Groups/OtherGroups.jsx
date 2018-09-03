import React, { Component } from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

const OtherGroups = ({ enterGroup, groups }) => (
  <div className='groups'>
    {groups.map(group => (
      <Card key={ group._id } className='card'>
        <CardTitle title={ group.name } />
        <CardText style={ { fontWeight: '400' } }>{ group.description }</CardText>
        <IconButton onTouchTap={ () => enterGroup(group._id) } >
          <FontIcon className='material-icons'>add_box</FontIcon>
        </IconButton>
      </Card>
    ))}
  </div>
);

export default OtherGroups;
