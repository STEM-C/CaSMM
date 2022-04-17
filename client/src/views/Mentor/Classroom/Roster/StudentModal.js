import { Modal, Button } from 'antd';
import React, { useState } from 'react';

export default function StudentModal({ linkBtn, student, getFormattedDate }) {
  const [visible, setVisible] = useState(false);

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
    <div>
      <button id={linkBtn ? 'link-btn' : null} onClick={showModal}>
        View
      </button>
      <Modal
        // title={student.name}
        visible={visible}
        onCancel={handleCancel}
        footer={[
          <Button key='ok' type='primary' onClick={handleOk}>
            OK
          </Button>,
        ]}
      >
        <div id='modal-student-card-header'>
          <p id='animal'>{student.character}</p>
          <h1 id='student-card-title'>{student.name}</h1>
        </div>
        <div id='modal-card-content-container'>
          <div id='description-container'>
            <p id='label'>Last logged in:</p>
            <p id='label-info'> {getFormattedDate(student.last_logged_in)}</p>
            <br></br>
          </div>
          <div id='description-container'>
            <p id='label'>Status:</p>
            <p id='label-info'>
              {student.enrolled.enrolled ? 'Enrolled' : 'Unenrolled'}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
