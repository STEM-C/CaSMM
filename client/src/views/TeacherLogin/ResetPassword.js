import { Form, Input, Button, message } from 'antd';
import React, { useState } from 'react';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    // const res = await forgetPassword(email);
    // console.log(res);
    // if (res.error) {
    //   message.error(res.error);
    // } else {
    //   message.success('Successfully send email');
    // }
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
