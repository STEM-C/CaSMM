import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, message, Button } from 'antd';
import DayEditor from '../DayEditor/DayEditor';
import {
  getLearningStandard,
  updateLearningStandard,
} from '../../../Utils/requests';

export default function LessonEditor({
  id,
  lessonName,
  learningStandard,
  history,
}) {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState(lessonName);
  const [description, setDescription] = useState('');
  const [teks, setTeks] = useState('');
  const [dayEditorVisible, setDayEditorVisible] = useState(false);

  const [displayName, setDisplayName] = useState(lessonName);

  const showModal = async () => {
    setVisible(true);
    const res = await getLearningStandard(id);
    setName(res.data.name);
    setDescription(res.data.expectations);
    setTeks(res.data.teks);
    setDayEditorVisible(false);
  };

  useEffect(() => {
    setDisplayName(lessonName);
  }, [lessonName]);

  useEffect(() => {
    const fetchLesson = async () => {
      const res = await getLearningStandard(id);
      setName(res.data.name);
      setDescription(res.data.expectations);
      setTeks(res.data.teks);
    };
    fetchLesson();
  }, [id]);

  const handleCancel = () => {
    setVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await updateLearningStandard(id, name, description, teks);
    if (response.err) {
      message.error('Fail to update lesson');
    } else {
      message.success('Update lesson success');
      setDisplayName(name);
      setVisible(false);
      setDayEditorVisible(true);
    }
  };

  return (
    <div>
      <button id='link-btn' onClick={showModal}>
        {displayName}
      </button>
      <Modal
        title='Lesson Editor'
        visible={visible}
        // onCancel={handleCancel}
        // onOk={handleSubmit}
        footer={[
          <Button key='cancel' onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key='next' type='primary' onClick={handleSubmit}>
            Next
          </Button>,
        ]}
      >
        <Form
          id='add-units'
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout='horizontal'
          size='default'
        >
          <Form.Item id='form-label' label='Lesson Name'>
            <Input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder='Enter lesson name'
            />
          </Form.Item>
          <Form.Item id='form-label' label='Description'>
            <Input.TextArea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              rows={3}
              placeholder='Enter lesson description'
            />
          </Form.Item>
          <Form.Item id='form-label' label='Teks'>
            <Input
              onChange={(e) => setTeks(e.target.value)}
              value={teks}
              placeholder='Enter lesson teks'
            />
          </Form.Item>
        </Form>
      </Modal>
      {/* <DayEditor history={history} learningStandard={learningStandard} test/> */}

      {dayEditorVisible ? (
        <DayEditor
          history={history}
          learningStandard={learningStandard}
          parentVisible={dayEditorVisible}
        />
      ) : (
        <div></div>
      )}
    </div>
  );
}
