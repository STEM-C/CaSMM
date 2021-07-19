import React from 'react';
import { Alert } from 'antd';

const Message = ({ type, message }) => {
  return <Alert message={message} type={type}></Alert>;
};

Message.defaultProps = {
  type: 'error',
};

export default Message;
