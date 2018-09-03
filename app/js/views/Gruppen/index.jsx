import React, { Component } from 'react';
import { Link } from 'react-router';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/social/group-add';

import UserGroupsContainer from '../../containers/Groups/UserGroupsContainer';
import OtherGroupsContainer from '../../containers/Groups/OtherGroupsContainer';
import Auth from '../../modules/Auth';


export default class Events extends Component {
  constructor() {
    super();
    this.state = {
      userGroups: [],
      otherGroups: [],
    };

    this.exitGroup = this.exitGroup.bind(this);
    this.enterGroup = this.enterGroup.bind(this);
  }

  componentDidMount() {
    const req = new XMLHttpRequest();
    req.open('GET', '/api/user/' + JSON.parse(localStorage.getItem('currentUser')).userID);
    req.responseType = 'json';

    req.addEventListener('load', () => {
      if (req.status === 200) {
        // Success!
        const res = req.response;
        this.setState({
          userGroups: res.groups,
        });
      }
    });

    req.send();

    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/group/user/' + JSON.parse(localStorage.getItem('currentUser')).userID, true);
    xhr.responseType = 'json';

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 400) {
        // Success!
        const res = xhr.response;
        this.setState({
          otherGroups: res,
        });
      }
    };

    xhr.send();

  }

  exitGroup(gId) {
    // HTTP Message:
    const httpMessage = 'gId=' + gId;

    // AJAX-Request
    const xhr = new XMLHttpRequest();
    xhr.open('put', '/api/user/' + JSON.parse(localStorage.getItem('currentUser')).userID);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // ERFOLG:
        const userGroups = this.state.userGroups.slice();
        const otherGroups = this.state.otherGroups.slice();

        let index;
        for (let i = 0; i < userGroups.length; i += 1) {
          if (userGroups[i]._id === gId) {
            index = i;
          }
        }

        const transferGroup = userGroups[index];
        userGroups.splice(index, 1);
        otherGroups.push(transferGroup);

        this.setState({
          userGroups: userGroups,
          otherGroups: otherGroups,
        });
      }
    });
    xhr.send(httpMessage);
  }

  enterGroup(gId) {
    // HTTP Message:
    const httpMessage = 'gId=' + gId;

    // AJAX-Request
    const xhr = new XMLHttpRequest();
    xhr.open('put', '/api/user/' + JSON.parse(localStorage.getItem('currentUser')).userID);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // ERFOLG:
        const userGroups = this.state.userGroups.slice();
        const otherGroups = this.state.otherGroups.slice();

        let index;
        for (let i = 0; i < otherGroups.length; i += 1) {
          if (otherGroups[i]._id === gId) {
            index = i;
          }
        }

        const transferGroup = otherGroups[index];
        otherGroups.splice(index, 1);
        userGroups.push(transferGroup);

        this.setState({
          userGroups: userGroups,
          otherGroups: otherGroups,
        });
      }
    });
    xhr.send(httpMessage);
  }

  render() {
    return (
      <div className='app-body'>
        <div className='card-container'>
          <h1 className='cardsHeader'>Deine Gruppen:</h1>
          <UserGroupsContainer groups={ this.state.userGroups } exitGroup={ this.exitGroup } />
        </div>

        <div className='card-container'>
          <h1 className='cardsHeader'>Andere Gruppen:</h1>
          <OtherGroupsContainer groups={ this.state.otherGroups } enterGroup={ this.enterGroup } />
        </div>

        <Link to='/gruppeerstellen' activeClassName='active'>
          <FloatingActionButton className='floatingButton'>
            <ContentAdd />
          </FloatingActionButton>
        </Link>
      </div>
    );
  }
}
