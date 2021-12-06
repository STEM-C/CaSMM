import { Modal, Button } from 'antd';
import React, { useState } from 'react';
import '../../DayPanels.less';

export default function CreatorModal(props) {
  const [visible, setVisible] = useState(false);
  const { saves, loadSave, lastAutoSave, getFormattedDate } = props;

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleOk = () => {
    setVisible(false);
  };

  const handleSelected = (selectedId) => {
    loadSave(selectedId);
    setVisible(false);
  };

  return (
    <div id='history-modal'>
      <Button onClick={showModal}>
        <div className='flex space-between'>
          <i id='eye-icon' className='fa fa-eye fa-lg' />
          <div>Version History</div>
        </div>
      </Button>
      <Modal
        title={'Your Version History'}
        visible={visible}
        onCancel={handleCancel}
        width='60vw'
        footer={[
          <Button key='ok' type='primary' onClick={handleOk}>
            OK
          </Button>,
        ]}
        bodyStyle={{ height: '50vh', overflow: 'auto' }}
      >
        <ul>
          <li key={-2}>
            <div id='history-item'>
              <div id='item-content'>Default template</div>
              <div id='item-content'>
                <Button onClick={() => handleSelected(-1)}>Start over</Button>
              </div>
            </div>
          </li>
        </ul>
      </Modal>
    </div>
  );
}
