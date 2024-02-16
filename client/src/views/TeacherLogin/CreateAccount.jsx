import { message } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import { CreateAccount } from '../../Utils/requests';
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

export default function AccountCreate() {
  const email = useFormInput('');
  const password = useFormInput('');
  const role = useFormInput('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setLoading(true);
    let body = { email: email.value, password: password.value, role: role.value };
    let body2 = {identifier: email.value, password: password.value};

    CreateAccount(body);
    postUser(body2)
      .then((response) => {
        setUserSession(response.data.jwt, JSON.stringify(response.data.user));
        setLoading(false);
        if (response.data.user.role.name === 'Content Creator') {
          navigate('/ccdashboard');
        } else if (response.data.user.role.name === 'Researcher') {
          navigate('/report');
        } else {
          navigate('/dashboard');
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
          <div id='box-title'>Create Account</div>
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
          <input
            type='password'
            {...password}
            placeholder='Confirm Password'
            autoComplete='current-password2'
          />
          

          <input
            type="Radio"
            name="Role"
            value="Classroom Manager"
            /> Mentor <br 
            />
        
         <input
            type="Radio"
            name="Role"
            value="Researcher"
            /> Researcher <br />
        
        <input
            type="Radio"
            name="Role"
            value="Teacher"
            /> Teacher <br />
        


          <input
            type='button'
            value={loading ? 'Loading...' : 'Create Account'}
            onClick={handleLogin}
            disabled={loading}
          />
          


        </form>
      </div>
    </div>
  );
}
