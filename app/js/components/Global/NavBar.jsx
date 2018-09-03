import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import FontIcon from 'material-ui/FontIcon';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';

const eventIcon = <FontIcon className='material-icons'>event</FontIcon>;
const groupIcon = <FontIcon className='material-icons'>group_work</FontIcon>;
const accountIcon = <FontIcon className='material-icons'>account_circle</FontIcon>;

export default class NavBar extends Component {

  render() {
    return (
      <Paper zDepth={ 1 } id='NavBar'>
        <BottomNavigation className='bottomNav'>
          <IndexLink to='/' activeClassName='active'>
            <BottomNavigationItem
              label='Events'
              icon={ eventIcon }
            />
          </IndexLink>

          <Link to='/gruppen' activeClassName='active'>
            <BottomNavigationItem
              label='Gruppen'
              icon={ groupIcon }
            />
          </Link>

          <Link to='/profil' activeClassName='active'>
            <BottomNavigationItem
              label='Profil'
              icon={ accountIcon }
            />
          </Link>
        </BottomNavigation>
      </Paper>
    );
  }
}
