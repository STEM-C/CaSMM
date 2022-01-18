import { Button, Select, message, Row, Col } from 'antd';
import React, { useState, useEffect, useReducer } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  handleOpenConnection,
  handleCloseConnection,
} from '../../Utils/consoleHelpers';
import Message from '../../../Message';

message.config({
  duration: 2,
  maxCount: 1,
});

export default function PlotterModal({
  connectionOpen,
  setConnectionOpen,
  show,
  plotData,
  setPlotData,
  plotId,
}) {
  const [baudRate, setBaudRate] = useState(9600);
  const [deviceDisconnect, setDeviceDisconnect] = useState(false);

  const [forceUpdate] = useReducer((x) => x + 1, 0);

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

  const handleConnect = async () => {
    if (!connectionOpen) {
      await handleOpenConnection(
        baudRate,
        'plot',
        plotData,
        setPlotData,
        plotId,
        forceUpdate
      );
      setConnectionOpen(true);
      setDeviceDisconnect(false);
    } else {
      await handleCloseConnection();
      plotId = 1;
      setConnectionOpen(false);
    }
  };

  const handleChange = (value) => {
    setBaudRate(value);
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
      </div>
      <div id='content-container' style={{ backgroundColor: '#EEEEEE' }}>
        <ResponsiveContainer width='90%' height='100%'>
          <LineChart width='100%' height='100%' data={plotData} key={plotData}>
            <Line
              type='step'
              dataKey='input'
              stroke='#8884d8'
              dot={false}
              isAnimationActive={false}
            />
            <CartesianGrid stroke='#ccc' />
            <XAxis
              dataKey='id'
              type='number'
              interval='preserveStartEnd'
              domain={[
                'dataMax-100',
                (dataMax) => (dataMax < 200 ? 200 : dataMax),
              ]}
            />
            <YAxis domain={['dataMin-6', 'dataMax+5']} />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Row>
        <Col span={12} />
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
              message='Serial Plotter Connection Opened'
              type='success'
            ></Message>
          ) : (
            <Message
              message='Serial Plotter Connection Not Opened'
              type='info'
            ></Message>
          )}
        </Col>
      </Row>
    </div>
  );
}
