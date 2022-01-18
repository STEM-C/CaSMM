import { Button, Checkbox, Select, Input, message, Row, Col } from 'antd';
import React, { useState, useEffect } from 'react';
import {
  writeToPort,
  handleOpenConnection,
  handleCloseConnection,
} from '../../Utils/consoleHelpers';
import Message from '../../../Message';

message.config({
  duration: 2,
  maxCount: 1,
});

export default function ConsoleModal({
  connectionOpen,
  setConnectionOpen,
  show,
}) {
  const [baudRate, setBaudRate] = useState(9600);
  const [input, setInput] = useState('');
  const [newLine, setnewLine] = useState(true);
  const [deviceDisconnect, setDeviceDisconnect] = useState(false);

  useEffect(() => {
    navigator.serial.addEventListener('disconnect', (e) => {
      console.log('device disconnected');
      window.port = undefined;
      setConnectionOpen(false);
      document.getElementById('connect-button').innerHTML = 'Connect';
      setDeviceDisconnect(true);
      message.error('Device Disconnected');
    });
    navigator.serial.addEventListener('connect', (e) => {
      setDeviceDisconnect(false);
      message.success('Device Connected');
    });
  }, [deviceDisconnect, setConnectionOpen]);

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      await sendInput();
    }
  };

  const handleConnect = async () => {
    if (!connectionOpen) {
      if (newLine) {
        console.log(baudRate);
        await handleOpenConnection(baudRate, 'newLine');
      } else {
        await handleOpenConnection(baudRate, 'notNewLine');
      }
      setConnectionOpen(true);
      setDeviceDisconnect(false);
    } else {
      await handleCloseConnection();
      setConnectionOpen(false);
    }
    setInput('');
  };

  const handleChange = (value) => {
    setBaudRate(value);
  };

  const sendInput = async () => {
    if (!connectionOpen) {
      window.alert('Connection not opened.');
      return;
    }
    await writeToPort(input);
    setInput('');
  };

  return (
    <div id='console-container' className={show ? 'open' : ''}>
      <div style={{ margin: '5px 0' }}>
        <strong style={{ fontSize: '10' }}>Baud Rate: </strong>
        <Select
          defaultValue={9600}
          onChange={handleChange}
          className={{ width: '15rem' }}
          disabled={connectionOpen}
        >
          <Select.Option value={300}>300</Select.Option>
          <Select.Option value={600}>600</Select.Option>
          <Select.Option value={1200}>1200</Select.Option>
          <Select.Option value={2400}>2400</Select.Option>
          <Select.Option value={4800}>4800</Select.Option>
          <Select.Option value={9600}>9600</Select.Option>
          <Select.Option value={14400}>14400</Select.Option>
          <Select.Option value={19200}>19200</Select.Option>
          <Select.Option value={28800}>28800</Select.Option>
          <Select.Option value={31250}>31250</Select.Option>
          <Select.Option value={38400}>38400</Select.Option>
          <Select.Option value={57600}>57600</Select.Option>
          <Select.Option value={115200}>115200</Select.Option>
        </Select>
        <Button
          id='connect-button'
          onClick={() => handleConnect()}
          style={{ marginLeft: '10px' }}
        >
          {connectionOpen ? 'Disconnect' : 'Connect'}
        </Button>
        <Checkbox
          checked={newLine}
          disabled={connectionOpen}
          onClick={() => {
            setnewLine(!newLine);
          }}
          style={{ marginLeft: '50px' }}
        >
          New Line
        </Checkbox>
      </div>
      <div id='content-container'>
        <p id='console-content'>Waiting for input...</p>
      </div>
      <Row>
        <Col span={10}>
          <Input
            type='text'
            value={input}
            placeholder='Enter your input: '
            id='console-message'
            autoComplete='off'
            onKeyPress={handleKeyPress}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          ></Input>
        </Col>
        <Col span={2}>
          <Button
            onClick={() => sendInput()}
            style={{ float: 'left', marginTop: '0.5vh' }}
          >
            Send
          </Button>
        </Col>
        <Col span={6}>
          {deviceDisconnect ? (
            <Message message='Device disconnected'></Message>
          ) : (
            <Message message='Device Connected' type='success'></Message>
          )}
        </Col>
        <Col span={6}>
          {connectionOpen ? (
            <Message
              message='Serial Monitor Connection Opened'
              type='success'
            ></Message>
          ) : (
            <Message
              message='Serial Monitor Connection Not Opened'
              type='info'
            ></Message>
          )}
        </Col>
      </Row>
    </div>
  );
}
