import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const LoginForm = ({
  onSubmit,
  onChange,
  errors,
  user }) => (
    <Card className='container form-container'>
      <form action='/' onSubmit={ onSubmit }>
        <h2 className='card-heading'>Einloggen</h2>

        {errors.summary && <p className='error-message'>{errors.summary}</p>}

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
            floatingLabelText='Password'
            type='password'
            name='password'
            onChange={ onChange }
            errorText={ errors.password }
            value={ user.password }
          />
        </div>

        <div className='button-line'>
          <RaisedButton type='submit' label='Einloggen' primary />
        </div>

        <CardText>Du hast noch keinen Account? <br/><Link to={ '/signup' }>Registrieren</Link></CardText>
      </form>
    </Card>
);

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default LoginForm;
