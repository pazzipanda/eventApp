import React, { Component } from 'react';
import { Card } from 'material-ui/Card';
import { browserHistory } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

export default class GruppeErstellen extends Component {
  constructor() {
    super();

    this.state = {
      error: '',
      group: {
        name: '',
        groupDesc: '',
      },
    };

    this.submitForm = this.submitForm.bind(this);
    this.changeGroup = this.changeGroup.bind(this);
  }

  submitForm(event) {
    event.preventDefault();

    // HTTP Message:
    const groupName = encodeURIComponent(this.state.group.name);
    const groupDesc = encodeURIComponent(this.state.group.groupDesc);
    const userID = JSON.parse(localStorage.getItem('currentUser')).userID;
    const httpMessage = 'name=' + groupName + '&owner=' + userID + '&description=' + groupDesc;

    // AJAX-Request
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/api/group/');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // ERFOLG:

        // Entferne alle Fehler aus dem State
        this.setState({
          // errors: {},
        });

        // Weiterleiten
        browserHistory.push('/gruppen');
      } else {
        // FEHLER:

        // Setze den Fehler im State
        this.setState({
          error: 'Es ist etwas schiefgelaufen :(',
        });
      }
    });
    xhr.send(httpMessage);
  }

  changeGroup(event) {
    const field = event.target.name;
    const group = this.state.group;
    group[field] = event.target.value;

    this.setState({
      group,
    });
  }

  render() {
    return (
      <div>

        <Card className='container form-container'>
          <form action='/' onSubmit={ this.submitForm }>
            <h2 className='card-heading'>Gruppe erstellen</h2>

            { this.state.error && <p className='error-message'>{this.state.error}</p>}

            <div className='field-line'>
              <TextField
                floatingLabelText='Gruppenname'
                name='name'
                onChange={ this.changeGroup }
                value={ this.state.group.name }
              />
              <TextField
                hintText='Beschreibung'
                name='groupDesc'
                onChange={ this.changeGroup }
                value={ this.state.group.groupDesc }
                multiLine
              />
            </div>

            <div className='button-line'>
              <RaisedButton type='submit' label='Erstellen' primary />
            </div>
          </form>
        </Card>

      </div>
    );
  }
}
