import { message } from 'antd';
import NavBar from '../../components/NavBar/NavBar';
import React, { useState } from 'react';
import { postUser, setUserSession } from '../../Utils/AuthRequests';
import './TeacherLogin.less';

const useFormInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    setValue(e.target.value);
  };
  return {
    value,
    onChange: handleChange,
  };
};

export default function TeacherLogin(props) {
  const email = useFormInput('');
  const password = useFormInput('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    let body = { identifier: email.value, password: password.value };

    postUser(body)
      .then((response) => {
        console.log(response.data);
        setUserSession(response.data.jwt, JSON.stringify(response.data.user));
        setLoading(false);
        if (response.data.user.role.name === 'Content Creator') {
          props.history.push('/ccdashboard');
        } else if (response.data.user.role.name === 'Researcher') {
          props.history.push('/report');
        } else {
          props.history.push('/dashboard');
        }
      })
      .catch((error) => {
        setLoading(false);
        message.error('Login failed. Please input a valid email and password.');
      });
  };

  return (
    <div className='container nav-padding'>
      <NavBar />
      <div id='content-wrapper'>
        <form
          id='box'
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleLogin();
          }}
        >
          <div id='box-title'>User Login</div>
          <input
            type='email'
            {...email}
            placeholder='Email'
            autoComplete='username'
          />
          <input
            type='password'
            {...password}
            placeholder='Password'
            autoComplete='current-password'
          />
          <p
            id='forgot-password'
            onClick={() => props.history.push('/forgot-password')}
          >
            Forgot Password?
          </p>
          <input
            type='button'
            value={loading ? 'Loading...' : 'Login'}
            onClick={handleLogin}
            disabled={loading}
          />
        </form>
      </div>
    </div>
  );
}
