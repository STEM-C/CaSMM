import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, message, Button } from 'antd';
import DayEditor from '../DayEditor/DayEditor';
import {
  getLearningStandard,
  updateLearningStandard,
} from '../../../Utils/requests';

export default function LessonEditor({
  learningStandard,
  history,
  viewing,
  setViewing,
  page,
}) {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState(learningStandard.name);
  const [description, setDescription] = useState('');
  const [teks, setTeks] = useState('');
  const [link, setLink] = useState('');

  const [displayName, setDisplayName] = useState(learningStandard.name);

  const showModal = async () => {
    setVisible(true);
    const res = await getLearningStandard(learningStandard.id);
    setName(res.data.name);
    setDescription(res.data.expectations);
    setTeks(res.data.teks);
    setLink(res.data.link);
  };

  useEffect(() => {
    setDisplayName(learningStandard.name);
  }, [learningStandard.name]);

  const handleCancel = () => {
    setVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await updateLearningStandard(
      learningStandard.id,
      name,
      description,
      teks,
      link
    );
    if (response.err) {
      message.error('Fail to update lesson');
    } else {
      message.success('Update lesson success');
      setDisplayName(name);
      history.push(`#${page}#${response.data.id}`);
      setViewing(response.data.id);
      setVisible(false);
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
          <Form.Item label='Link to Additional Resource'>
            <Input
              onChange={(e) => {
                setLink(e.target.value);
              }}
              value={link}
              placeholder='Enter a link'
            />
          </Form.Item>
        </Form>
      </Modal>
      {!visible ? (
        <DayEditor
          history={history}
          learningStandard={learningStandard}
          viewing={viewing}
          page={page}
        />
      ) : null}
    </div>
  );
}
