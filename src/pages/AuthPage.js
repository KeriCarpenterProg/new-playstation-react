import React, { useState } from 'react';
import { baseUrl } from '../app/shared/baseUrl';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [mode, setMode] = useState('login'); // or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setStatus('Loading...');

    const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';

    try {
      const payload = mode === 'login'
        ? { email, password }
        : { email, password, first_name: firstName, last_name: lastName };

      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Request failed');

      localStorage.setItem('authToken', data.token);
      const displayName = data.user.first_name || 'Player';
      localStorage.setItem('authUserName', displayName);
      localStorage.setItem('authUserPicture', data.user.picture_url || '');
      setStatus(`Success! Logged in as ${displayName}`);
      navigate('/');
    } catch (err) {
      setStatus(err.message);
      setError(err.message);
    }
  };


  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
      <Form onSubmit={submit}>
        {mode === 'register' && (
          <>
            <FormGroup>
              <Label htmlFor='firstName'>First Name</Label>
              <Input
                type='text'
                id='firstName'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor='lastName'>Last Name</Label>
              <Input
                type='text'
                id='lastName'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </FormGroup>
          </>
        )}
        <FormGroup>
          <Label htmlFor='email'>Email</Label>
          <Input
            type='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor='password'>Password</Label>
          <Input
            type='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button type='submit' color='primary'>
          {mode === 'login' ? 'Login' : 'Register'}
        </Button>
        <Button
          type='button'
          style={{ marginLeft: 'auto' }}
          color='secondary'
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        >
          {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
        </Button>
        </div>
      </Form>
      {status && <p>{status}</p>}
      {status === 'Loading...' && <p>Loading...</p>}
      {error && <p className='text-danger'>{error}</p>}
    </div>
  );
};

export default AuthPage;