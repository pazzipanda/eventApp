import React, { Component } from 'react';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import Auth from '../../modules/Auth';

export default class AppBar extends Component {
  render() {
    if (Auth.isUserAuthenticated()) {
      return (
        <div id='AppBar'>
          <Link className='appBarBtn' to='/logout'>
            <FlatButton label="Ausloggen" rippleColor='#0A80FC' labelStyle={ { color: 'white', fontSize: '12px' } } style={ { height: 'auto' } } />
          </Link>
        </div>
      );
    } else {
      return (
        <div id='AppBar'>
          <div id='AppBar'>
            <Link className='appBarBtn' to='/profil'>
              <FlatButton label="Einloggen" rippleColor='#0A80FC' labelStyle={ { color: 'white', fontSize: '12px' } } style={ { height: 'auto' } } />
            </Link>
          </div>
        </div>
      );
    }


  }
}
