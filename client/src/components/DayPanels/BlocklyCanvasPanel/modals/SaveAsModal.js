import { Modal, Button, Input, Form, message, Menu } from 'antd';
import { handleSaveAsWorkspace } from '../../Utils/helpers';
import React, { useState } from 'react';
import { getCCWorkspaceToolbox } from '../../../../Utils/requests';
import { useGlobalState } from '../../../../Utils/userState';

export default function SaveAsModal({
  workspaceRef,
  studentToolbox,
  visible,
  setVisible,
  day,
  setDay,
  isSandbox,
  classroomId,
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [value] = useGlobalState('currUser');

  const showModal = () => {
    setName('');
    setDescription('');
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleSaveAs = async () => {
    const res = await handleSaveAsWorkspace(
      name,
      description,
      workspaceRef,
      studentToolbox,
      classroomId
    );
    if (res.err) {
      message.error(res.err);
    } else {
      let localDay = res.data;
      // if we are on sandbox mode, set the current workspace to the saved worksapce
      if (isSandbox) {
        if (value.role === 'ContentCreator') {
          const toolboxRes = await getCCWorkspaceToolbox(res.data.id);
          if (toolboxRes.data) {
            message.success('Workspace saved successfully');
            localDay = {
              ...localDay,
              selectedToolbox: toolboxRes.data.toolbox,
              toolbox: day.toolbox,
            };
          } else {
            message.error(toolboxRes.err);
          }
        } else if (value.role === 'Mentor') {
          message.success('Workspace saved successfully');
        }
      }
      setDay(localDay);
      setVisible(false);
    }
  };

  return (
    <div>
      <Menu.Item id='menu-save' onClick={showModal}>
        <i className='fa fa-save'></i>
        <i id='pencil-icon' className='fas fa-pencil-alt'></i>
        &nbsp;Save As
      </Menu.Item>
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
