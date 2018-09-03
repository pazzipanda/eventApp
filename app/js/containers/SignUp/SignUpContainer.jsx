import React from 'react';
import { browserHistory } from 'react-router';
import SignUpForm from '../../components/SignUp/SignUpForm';

class SignUpContainer extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      errors: {},
      user: {
        email: '',
        name: '',
        password: '',
      },
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  processForm(event) {
    event.preventDefault();

    // HTTP Message:
    const name = encodeURIComponent(this.state.user.name);
    const email = encodeURIComponent(this.state.user.email);
    const password = encodeURIComponent(this.state.user.password);
    const httpMessage = 'name=' + name + '&email=' + email + '&password=' + password;

    // AJAX-Request
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/api/auth/signup');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // ERFOLG:

        // Entferne alle Fehler aus dem State
        this.setState({
          errors: {},
        });

        // Leite weiter auf Login
        browserHistory.push('/login');
      } else {
        // FEHLER:

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
      <SignUpForm
        onSubmit={ this.processForm }
        onChange={ this.changeUser }
        errors={ this.state.errors }
        user={ this.state.user }
      />
    );
  }

}

export default SignUpContainer;
