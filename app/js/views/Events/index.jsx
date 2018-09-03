import React, { Component } from 'react';
import { Link } from 'react-router';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/action/event';

import UserEventListContainer from '../../containers/Events/UserEventsContainer';
import OtherEventListContainer from '../../containers/Events/OtherEventsContainer';
import Auth from '../../modules/Auth';

export default class Events extends Component {
  constructor() {
    super();
    this.state = {
      activeEvents: [],
      possibleEvents: [],
    };

    this.attendEvent = this.attendEvent.bind(this);
    this.cancelEvent = this.cancelEvent.bind(this);
  }

  componentDidMount() {
    const req = new XMLHttpRequest();
    req.open('GET', '/api/user/' + JSON.parse(localStorage.getItem('currentUser')).userID);
    req.responseType = 'json';

    req.addEventListener('load', () => {
      if (req.status === 200) {
        // Success!
        const res = req.response;
        const activeEvents = res.activeEvents;
        const possibleEvents = res.possibleEvents;

        activeEvents.sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });

        possibleEvents.sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });

        this.setState({
          activeEvents: activeEvents,
          possibleEvents: possibleEvents,
        });
      }
    });

    req.send();
  }

  attendEvent(eventId) {
    // HTTP Message:
    const httpMessage = 'eventId=' + eventId;

    // AJAX-Request
    const xhr = new XMLHttpRequest();
    xhr.open('put', '/api/user/' + JSON.parse(localStorage.getItem('currentUser')).userID);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // ERFOLG:
        const activeEvents = this.state.activeEvents.slice();
        const possibleEvents = this.state.possibleEvents.slice();

        let index;
        for (let i = 0; i < possibleEvents.length; i += 1) {
          if (possibleEvents[i]._id === eventId) {
            index = i;
          }
        }

        const transferEvent = possibleEvents[index];
        possibleEvents.splice(index, 1);
        activeEvents.push(transferEvent);

        activeEvents.sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });

        possibleEvents.sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });

        this.setState({
          activeEvents: activeEvents,
          possibleEvents: possibleEvents,
        });
      }
    });
    xhr.send(httpMessage);
  }

  cancelEvent(eventId) {
    // HTTP Message:
    const httpMessage = 'eventId=' + eventId;

    // AJAX-Request
    const xhr = new XMLHttpRequest();
    xhr.open('put', '/api/user/' + JSON.parse(localStorage.getItem('currentUser')).userID);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // ERFOLG:
        const activeEvents = this.state.activeEvents.slice();
        const possibleEvents = this.state.possibleEvents.slice();

        let index;
        for (let i = 0; i < activeEvents.length; i += 1) {
          if (activeEvents[i]._id === eventId) {
            index = i;
          }
        }

        const transferEvent = activeEvents[index];
        activeEvents.splice(index, 1);
        possibleEvents.push(transferEvent);

        activeEvents.sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });

        possibleEvents.sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });

        this.setState({
          activeEvents: activeEvents,
          possibleEvents: possibleEvents,
        });
      }
    });
    xhr.send(httpMessage);
  }

  render() {
    return (
      <div className='app-body'>

        <div className='card-container'>
          <h1 className='cardsHeader'>Deine Events:</h1>
          <UserEventListContainer events={ this.state.activeEvents } cancelEvent={ this.cancelEvent } />
        </div>

        <div className='card-container'>
          <h1 className='cardsHeader'>Andere Events:</h1>
          <OtherEventListContainer events={ this.state.possibleEvents } attendEvent={ this.attendEvent } />
        </div>

        <Link to='/eventserstellen' activeClassName='active'>
          <FloatingActionButton className='floatingButton'>
            <ContentAdd />
          </FloatingActionButton>
        </Link>
      </div>
    );
  }
}
