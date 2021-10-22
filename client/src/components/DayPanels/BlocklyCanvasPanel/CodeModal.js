import { Modal, Button, Typography } from 'antd';
import React, { useState } from 'react';
import { getArduino, getXml } from '../helpers';
import icon from './Icons/textIcon.json';

export default function CodeModal(props) {
  const [visible, setVisible] = useState(false);
  const { title, workspaceRef, setHover, hover } = props;
  const { Text } = Typography;

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleOk = () => {
    setVisible(false);
  };

  return (
    <div id='code-modal'>
      {title === 'XML' ? (
        <i
          onClick={showModal}
          id='link'
          className='fa fa-code hvr-info'
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        />
      ) : (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='hvr-info'
          viewBox='0 0 172 172'
          onClick={showModal}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <g>
            <path d={icon.path}></path>
          </g>
        </svg>
      )}

      {hover &&
        (title === 'XML' ? (
          <div className='popup ModalCompile2'>Shows XML</div>
        ) : (
          <div className='popup ModalCompile3'>Shows Arduino Code</div>
        ))}
      <Modal
        title={title}
        visible={visible}
        onCancel={handleCancel}
        width='50vw'
        footer={[
          <Button key='ok' type='primary' onClick={handleOk}>
            OK
          </Button>,
        ]}
      >
        {workspaceRef ? (
          <div id='code-text-box'>
            <Text copyable style={{ whiteSpace: 'pre-wrap' }}>
              {title === 'XML'
                ? getXml(workspaceRef, false)
                : getArduino(workspaceRef, false)}
            </Text>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
