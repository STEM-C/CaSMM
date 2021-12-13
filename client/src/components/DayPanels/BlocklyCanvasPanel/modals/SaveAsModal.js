import { Modal, Button, Input, Form, message } from 'antd';
import { handleCreatorSaveAsWorkspace } from '../../Utils/helpers';
import React, { useState } from 'react';
import { getCCWorkspaceToolbox } from '../../../../Utils/requests';

export default function SaveAsModal({
  hover,
  setHover,
  workspaceRef,
  studentToolbox,
  visible,
  setVisible,
  day,
  setDay,
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const showModal = () => {
    setName('');
    setDescription('');
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleSaveAs = async () => {
    const res = await handleCreatorSaveAsWorkspace(
      name,
      description,
      workspaceRef,
      studentToolbox
    );
    if (res.err) {
      message.error(res.err);
    } else {
      const toolboxRes = await getCCWorkspaceToolbox(res.data.id);
      if (toolboxRes.data) {
        message.success('Workspace saved successfully');
        let localDay = {
          ...res.data,
          selectedToolbox: toolboxRes.data.toolbox,
          toolbox: day.toolbox,
        };
        setDay(localDay);
        setVisible(false);
      } else {
        message.error(toolboxRes.err);
      }
    }
  };

  return (
    <div id='link'>
      <i
        onClick={showModal}
        className='flex fas fa-file-download'
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      />
      {hover && <div className='popup ModalCompile4'>SaveAs</div>}
      <Modal
        title='Save As'
        visible={visible}
        onCancel={handleCancel}
        width='25vw'
        footer={null}
      >
        <Form
          layout='horizontal'
          size='default'
          labelCol={{
            span: 7,
          }}
          wrapperCol={{
            span: 14,
          }}
          onFinish={handleSaveAs}
        >
          <Form.Item label='Workspace Name: '>
            <Input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type='text'
              placeholder='Enter workspace name'
              required
            ></Input>
          </Form.Item>
          <Form.Item label='Description: '>
            <Input.TextArea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              type='text'
              placeholder='Enter description'
              required
            ></Input.TextArea>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 2,
              span: 20,
            }}
            style={{ marginBottom: '0px' }}
          >
            <Button
              type='primary'
              htmlType='submit'
              className='content-creator-button'
            >
              Submit
            </Button>
            <Button onClick={handleCancel} className='content-creator-button'>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
