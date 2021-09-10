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
  tab,
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
    console.log(e);
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
      history.push(`#${tab}#${page}#${response.data.id}`);
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
        width='35vw'
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          id='add-units'
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 14,
          }}
          onFinish={handleSubmit}
          layout='horizontal'
          size='default'
        >
          <Form.Item id='form-label' label='Lesson Name'>
            <Input
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
              placeholder='Enter lesson name'
            />
          </Form.Item>
          <Form.Item id='form-label' label='Description'>
            <Input.TextArea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              rows={3}
              required
              placeholder='Enter lesson description'
            />
          </Form.Item>
          <Form.Item id='form-label' label='Teks'>
            <Input
              onChange={(e) => setTeks(e.target.value)}
              value={teks}
              required
              placeholder='Enter lesson teks'
            />
          </Form.Item>
          <Form.Item label='Link to Additional Resources (Optional)'>
            <Input
              onChange={(e) => {
                setLink(e.target.value);
              }}
              value={link}
              placeholder='Enter a link'
            />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
            style={{ marginBottom: '0px' }}
          >
            <Button
              type='primary'
              htmlType='submit'
              size='large'
              className='content-creator-button'
            >
              Next
            </Button>
            <Button
              onClick={handleCancel}
              size='large'
              className='content-creator-button'
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {!visible ? (
        <DayEditor
          history={history}
          learningStandard={learningStandard}
          viewing={viewing}
          setViewing={setViewing}
          page={page}
          tab={tab}
        />
      ) : null}
    </div>
  );
}
