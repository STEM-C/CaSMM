import { Form, Input, Button, message, Alert } from 'antd';
import React, { useState, useEffect } from 'react';
import { forgetPassword } from '../../Utils/requests';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [timeout, setTimeout] = useState(0);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);

  const handleSubmit = async (e) => {
    setShowSuccessMsg(false);
    const res = await forgetPassword(email);
    console.log(res);
    if (res.error) {
      message.error(res.error);
    } else {
      message.success('Successfully send email');
      setTimeout(120);
      setShowSuccessMsg(true);
    }
  };
  useEffect(() => {
    let myInterval = setInterval(() => {
      if (timeout > 0) {
        setTimeout(timeout - 1);
      }
    }, 1000);
    console.log(timeout);
    return () => clearInterval(myInterval);
  });

  return (
    <div>
      <h1>Fotgot Password</h1>
      <Form onFinish={handleSubmit}>
        <Form.Item id='form-label' label='Email'>
          <Input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type='email'
            placeholder='Enter your email'
            required
          />
        </Form.Item>
        {showSuccessMsg && (
          <Alert
            type='success'
            message='Successfully send the reset password link. Please check your email inbox as well as the spam folder for the next steps. '
          ></Alert>
        )}
        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            size='large'
            disabled={timeout > 0}
          >
            {timeout <= 0 ? 'Submit' : '(' + timeout + ')'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ForgetPassword;
