import React from 'react';
import { Link } from 'react-router';
import Avatar from 'material-ui/Avatar';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';


class Profil extends React.Component {
  render() {
    let currentUser;
    if (localStorage.getItem('currentUser') !== '') {
      currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    let imgURL = window.location.origin;
    imgURL += '/'+currentUser.image;

    return (
      <Card>
        <CardText>
          <div className='loggedProfile'>
            <Avatar size={ 150 } src={ imgURL } />
            <h1>{ currentUser.name }</h1>
            <p>{ currentUser.email }</p>
            <p>{ currentUser.desc }</p>
          </div>
        </CardText>
      </Card>
    );
  }
}

export default Profil;
