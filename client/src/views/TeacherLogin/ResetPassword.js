import { Form, Input, Button, message } from 'antd';
import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { resetPassword } from '../../Utils/requests';
import NavBar from '../../components/NavBar/NavBar';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const search = useLocation().search;
  const code = new URLSearchParams(search).get('code');

  const handleSubmit = async (e) => {
    if (password !== confirmPassword) {
      message.error('Passwords do not match! Please try again.');
      setPassword('');
      setConfirmPassword('');
    } else {
      setLoading(true);
      const res = await resetPassword(code, password, confirmPassword);
      if (res.err) {
        message.error(res.err);
      } else {
        message.success(`User's password has been reset!`);
        history.push('/teacherlogin');
      }
      setLoading(false);
    }
  };

  return (
    <div className='container nav-padding'>
       <NavBar/>
      <div id='reset-pass-wrapper'>
        <div id='reset-pass-title'>Reset Password</div>
        <Form id='reset-pass-form' onFinish={handleSubmit}>
          <Form.Item id='form-label' label='New Password'>
            <Input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type='password'
              placeholder='Enter your new password'
              minLength={6}
              maxLength={15}
              required
            />
          </Form.Item>
          <Form.Item id='form-label' label='Confirm Password'>
            <Input
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              type='password'
              placeholder='Confirm your new password'
              minLength={6}
              maxLength={15}
              required
            />
          </Form.Item>
          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              size='large'
              disabled={loading}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
        </div>
    </div>
  );
};

export default ResetPassword;
