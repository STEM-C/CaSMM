import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { submitBugReport } from '../../Utils/requests';
import NavBar from '../../components/NavBar/NavBar';
import { useNavigate } from 'react-router-dom';
import "./BugReport.less";

const BugReport = () => {
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async () => {
    let systemInfo = navigator.userAgent;
    let screenSize = ` Screen (${window.screen.height}, ${window.screen.width})`;
    systemInfo += screenSize;

    const res = await submitBugReport(
      description,
      steps,
      name,
      email,
      systemInfo
    );
    if (res.err) {
      message.error(res.err);
    } else {
      message.success('Successfully submitted bug report!');
      navigate('/');
    }
  };

  return (
    <div className='container nav-padding'>
      <NavBar />
      <div id='bug-report-wrapper' style={{ marginTop: '0px' }}>
        <div id='bug-report-title'>Report a Bug</div>
        <Form id='bug-report-form' onFinish={handleSubmit}>
          <Form.Item id='form-label' label='Contact name'>
            <Input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type='text'
              placeholder='Enter your name'
              required
            />
          </Form.Item>
          <Form.Item id='form-label' label='Contact Email'>
            <Input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type='email'
              placeholder='Enter your email'
              required
            />
          </Form.Item>
          <Form.Item id='form-label' label='Description of the bug'>
            <Input.TextArea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              type='text'
              placeholder='Enter description'
              required
              autoComplete='off'
            />
          </Form.Item>
          <Form.Item id='form-label' label='Steps to reproduce the bug'>
            <Input.TextArea
              onChange={(e) => setSteps(e.target.value)}
              value={steps}
              type='text'
              placeholder='Enter steps to reproduce the bug'
              required
              autoComplete='off'
            />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' size='large'>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default BugReport;
