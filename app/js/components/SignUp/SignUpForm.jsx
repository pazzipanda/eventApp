import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const SignUpForm = ({
  onSubmit,
  onChange,
  errors,
  user,
}) => (
  <Card className='container form-container'>
    <form action='/' onSubmit={ onSubmit }>
      <h2 className='card-heading'>Registrieren</h2>

      {errors.summary && <p className='error-message'>{errors.summary}</p>}

      <div className='field-line'>
        <TextField
          floatingLabelText='Name'
          name='name'
          errorText={ errors.name }
          onChange={ onChange }
          value={ user.name }
        />
      </div>

      <div className='field-line'>
        <TextField
          floatingLabelText='E-Mail'
          name='email'
          errorText={ errors.email }
          onChange={ onChange }
          value={ user.email }
        />
      </div>

      <div className='field-line'>
        <TextField
          floatingLabelText='Passwort'
          type='password'
          name='password'
          errorText={ errors.password }
          onChange={ onChange }
          value={ user.password }
        />
      </div>

      <div className='button-line'>
        <RaisedButton type='submit' label='Registrieren' primary />
      </div>

      <CardText>Du hast schon einen Account? <br/><Link to={ '/login' }>Einloggen</Link></CardText>
    </form>
  </Card>
);

SignUpForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default SignUpForm;
