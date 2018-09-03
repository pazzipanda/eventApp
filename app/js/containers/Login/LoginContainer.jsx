import React from 'react';
import { browserHistory } from 'react-router';
import Auth from '../../modules/Auth';
import LoginForm from '../../components/Login/LoginForm';

class LoginContainer extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      errors: {},
      user: {
        email: '',
        password: '',
      },
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  processForm(event) {
    event.preventDefault();

    // HTTP Message:
    const email = encodeURIComponent(this.state.user.email);
    const password = encodeURIComponent(this.state.user.password);
    const httpMessage = 'email=' + email + '&password=' + password;

    // AJAX-Request
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/api/auth/login');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // ERFOLG:

        // Entferne alle Fehler aus dem State
        this.setState({
          errors: {},
        });

        // Speichere den Token
        Auth.authenticateUser(xhr.response.token);

        // Speichere den eingeloggten User im LocalStorage
        localStorage.setItem('currentUser', JSON.stringify(xhr.response.user));

        // Weiterleiten
        browserHistory.push('/profil');
      } else {
        // FEHLER:

        // Setze den Fehler im State
        const errors = xhr.response.errors ? xhr.response.errors : {};
        errors.summary = xhr.response.message;

        this.setState({
          errors,
        });
      }
    });
    xhr.send(httpMessage);
  }

  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user,
    });
  }

  render() {
    return (
      <LoginForm
        onSubmit={ this.processForm }
        onChange={ this.changeUser }
        errors={ this.state.errors }
        successMessage={ this.state.successMessage }
        user={ this.state.user }
      />
    );
  }

}

export default LoginContainer;
