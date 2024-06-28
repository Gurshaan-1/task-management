import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Header from '../Header/Header.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import img1 from './image1.png';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setShowError(false); // Hide error when user starts typing
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setShowError(false); // Hide error when user starts typing
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password.length < 5) {
      setShowError(true);
      setErrorMessage('Password should be at least 5 characters long.');
    } else {
      axios
        .post('http://localhost:3001/login', { email, password })
        .then((response) => {
          const { role, name } = response.data;
          if (role === 'admin') {
            navigate(`/manager?name=${name}`);
          } else {
            navigate(`/user?name=${name}`);
          }
        })
        .catch((error) => {
          setErrorMessage('Invalid email or password.');
          setShowError(true);
          console.log(error);
        });
    }
  };

  return (
    <>
      <Header />
      <div
        style={{
          backgroundImage: `url(${img1})`,
          backgroundSize: 'cover',
          display: 'flex',
          flexDirection: 'column', // Display the elements in a column
          alignItems: 'center',
          justifyContent: 'center',
          height: '91.2vh',
        }}
      >
        <div
          style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            transition: 'box-shadow 0.3s ease-in-out',
            maxWidth: '400px',
            width: '100%',
            position: 'relative', // Set position to enable hover animation
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)')}
        >
          {showError && (
            <Alert variant="danger">
              {errorMessage}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <h2 className='text-center'>Login</h2>
            <hr/>
            <Form.Group controlId="email">
              <Form.Label>Email:</Form.Label>
              <Form.Control type="email" value={email} onChange={handleEmailChange} />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password:</Form.Label>
              <Form.Control type="password" value={password} onChange={handlePasswordChange} />
            </Form.Group>
            <Button variant="primary" type="submit" className='mt-3'>
              Login
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
