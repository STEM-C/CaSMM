import { message } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import { postUser, setUserSession, regUser, getSupers, getConfirmed } from '../../Utils/AuthRequests';
import { sendEmailConfirmationEmail} from '../../Utils/requests';
import './TeacherLogin.less';
//import { findSuperAdmins } from '../../../../server/extensions/users-permissions/controllers/Auth';


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
  const username = useFormInput('');
  const email = useFormInput('');
  const password = useFormInput('');
  const confirm_password = useFormInput('');
  const role = useFormInput('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const superEmails = [];

  const handleLogin = () => {
    setLoading(true);
    let body = { username: username.value, email: email.value, password: password.value, role: role.value};
    let body2 = {identifier: email.value, password: password.value};

    if (password.value != confirm_password.value){
      setLoading(false);
      message.error('Passwords must match!');
      return null;
    }

    if (role.value == '') {
      setLoading(false);
      message.error('Please select a role!');
      return null;
    }

    regUser(body)
      .then((response) => {

        postUser(body2)
          .then((response) => {
            
            setUserSession(response.data.jwt, JSON.stringify(response.data.user));
            //console.log(getConfirmed());
            setLoading(false);
            if (response.data.user.role.name === 'Content Creator') {

              navigate('/ccdashboard');
            } else if (response.data.user.role.name === 'Researcher') {
              navigate('/report');
            } else {

              navigate('/dashboard');
            }
            if (!response.data.user.confirmed) {
              navigate('/sorry');
            }
          })
          .catch((error) => {
            setLoading(false);
            message.error('Login failed. Please input a valid email and password.');
          })
        getSupers()
          .then(superAdmins => {
            for (var i = 0; i < superAdmins.data.length; i++){
              if (superAdmins.data[i].isActive) {
                superEmails.push(superAdmins.data[i].email);
              };

            };
            //console.log('Super admins:', superEmails);
            //console.log(superEmails[1]);
            for (var i = 0; i < superEmails.length; i++){
              sendEmailConfirmationEmail(email.value, superEmails[i])
                .then(response => {
                  //console.log('hihihi');
                })
            };
          })

      })
      .catch((error) => {
        setLoading(false);
        message.error(error.response.data.message[0].messages[0].message);
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
            {...username}
            placeholder='Username'
            autoComplete='username'
          />
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
            {...confirm_password}
            placeholder='Confirm Password'
            autoComplete='current-password2'
          />
          

          <input
            type="Radio"
            {...role}
            name="Role"
            value="authenticated"
            /> Mentor <br 
            />
        
         <input
            type="Radio"
            {...role}
            name="Role"
            value="researcher"
            /> Researcher <br />
        
        <input
            type="Radio"
            {...role}
            name="Role"
            value="content_creator"
            /> Content Creator <br />
        


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
