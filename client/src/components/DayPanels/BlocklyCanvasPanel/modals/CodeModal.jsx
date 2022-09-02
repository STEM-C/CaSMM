import { Modal, Button, Typography, Menu } from 'antd';
import React, { useState } from 'react';
import { getArduino, getXml } from '../../Utils/helpers';

export default function CodeModal(props) {
  const [visible, setVisible] = useState(false);
  const { title, workspaceRef } = props;
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
        <Menu.Item onClick={showModal}>
          <i className='far fa-file-code' />
          &nbsp;Show XML
        </Menu.Item>
      ) : (
        <Menu.Item id='show-arduino-icon' onClick={showModal}>
          <i className='fas fa-code' />
          &nbsp;Show Arduino Code
        </Menu.Item>
      )}
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
