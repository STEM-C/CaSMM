import { Button, Checkbox, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import { openConnection, disconnect, writeToPort } from '../ConsoleView';

export default function ConsoleModal(props) {
  const [connectionOpen, setConnectionOpen] = useState(false);
  const [baudRate, setBaudRate] = useState(9600);
  const [input, setInput] = useState('');
  const [newLine, setnewLine] = useState(false);

  useEffect(() => {
    navigator.serial.addEventListener('disconnect', (e) => {
      console.log('device disconnected');
      window.port = undefined;
      console.log('cleaned');
      setConnectionOpen(false);
      document.getElementById('connect-button').innerHTML = 'Connect';
    });
  });

  const handleConnect = async () => {
    if (!connectionOpen) {
      if (typeof window['port'] === 'undefined') {
        const filters = [
          { usbVendorId: 0x2341, usbProductId: 0x0043 },
          { usbVendorId: 0x2341, usbProductId: 0x0001 },
        ];
        let port;
        try {
          port = await navigator.serial.requestPort({ filters });
        } catch (e) {
          console.log(e);
          return;
        }
        window['port'] = port;
      }
      setConnectionOpen(true);
      document.getElementById('connect-button').innerHTML = 'Disconnect';
      openConnection(baudRate, newLine);
    } else {
      console.log('Close connection');
      disconnect();
      setConnectionOpen(false);
      document.getElementById('connect-button').innerHTML = 'Connect';
    }
  };

  const handleChange = ({ value }) => {
    setBaudRate(value);
  };

  const sendInput = () => {
    if (!connectionOpen) {
      window.alert('Connection not opened.');
      return;
    }
    console.log(input);
    writeToPort(input);
  };

  return (
    <div id='console-container'>
      <div style={{ margin: '10px 0' }}>
        <strong style={{ fontSize: '10' }}>Baud Rate: </strong>
        <Select
          defaultValue='9600'
          onChange={handleChange}
          className={{ width: '15rem' }}
          disabled={connectionOpen}
        >
          <Select.Option value='300'>300</Select.Option>
          <Select.Option value='600'>600</Select.Option>
          <Select.Option value='1200'>1200</Select.Option>
          <Select.Option value='2400'>2400</Select.Option>
          <Select.Option value='4800'>4800</Select.Option>
          <Select.Option value='9600'>9600</Select.Option>
          <Select.Option value='14400'>14400</Select.Option>
          <Select.Option value='19200'>19200</Select.Option>
          <Select.Option value='28800'>28800</Select.Option>
          <Select.Option value='31250'>31250</Select.Option>
          <Select.Option value='38400'>38400</Select.Option>
          <Select.Option value='57600'>57600</Select.Option>
          <Select.Option value='115200'>115200</Select.Option>
        </Select>
        <Button
          id='connect-button'
          onClick={() => handleConnect()}
          style={{ marginLeft: '10px' }}
        >
          Connect
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
      <div>
        <input
          type='text'
          value={input}
          placeholder='Enter your message'
          onChange={(e) => {
            setInput(e.target.value);
          }}
          style={{ width: '25rem' }}
        ></input>
        <Button
          id='connect-button'
          onClick={() => sendInput()}
          style={{ marginLeft: '10px' }}
        >
          Send
        </Button>
      </div>
      <div id='content-container'>
        <p id='console-content'>Waiting for input...</p>
      </div>
    </div>
  );
}
