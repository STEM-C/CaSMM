import { Form, Input, Button, message } from 'antd';
import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { resetPassword } from '../../Utils/requests';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const history = useHistory();
  const search = useLocation().search;
  const code = new URLSearchParams(search).get('code');

  const handleSubmit = async (e) => {
    if (password != confirmPassword) {
      message.error('Passwords do not match! Please try again.');
      setPassword('');
      setConfirmPassword('');
    } else {
      const res = await resetPassword(code, password, confirmPassword);
      if (res.error) {
        message.error(res.error);
      } else {
        message.success(`User's password has been reset!`);
        history.push('/teacherlogin');
      }
    }
  };

  return (
    <div>
      <h1>Reset Password</h1>
      <Form onFinish={handleSubmit}>
        <Form.Item id='form-label' label='New Password'>
          <Input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type='password'
            placeholder='Enter your new password'
            required
          />
        </Form.Item>
        <Form.Item id='form-label' label='Confirm Password'>
          <Input
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            type='password'
            placeholder='Confirm your new password'
            required
          />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' size='large'>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ResetPassword;
