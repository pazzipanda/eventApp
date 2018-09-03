import React, { Component } from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

const OtherEventList = ({ events, attendEvent }) => (
  <div className='cards'>
    {events.map(event => (
      <Card key={ event._id } className='card'>
        <CardTitle style={ { paddingBottom: '0px' } } title={ event.name } />
        <CardText style={ { paddingTop: '10px', color: 'rgba(0, 0, 0, 0.54)', fontWeight: '100' } }>{ event.date.slice(4, -18) } Uhr</CardText>
        <CardText style={ { fontWeight: '400' } }>{ event.description }</CardText>
        <IconButton onTouchTap={ () => attendEvent(event._id) } >
          <FontIcon className='material-icons'>done</FontIcon>
        </IconButton>
      </Card>
    ))}
  </div>
);

export default OtherEventList;
