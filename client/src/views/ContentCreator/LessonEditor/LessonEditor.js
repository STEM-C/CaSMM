import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, message, Button } from 'antd';
import DayEditor from '../DayEditor/DayEditor';
import {
  getLearningStandard,
  updateLearningStandard,
} from '../../../Utils/requests';
import { useSearchParams } from 'react-router-dom';

export default function LessonEditor({
  learningStandard,
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
  const [linkError, setLinkError] = useState(false);
  const [displayName, setDisplayName] = useState(learningStandard.name);
  // eslint-disable-next-line
  const [_, setSearchParams] = useSearchParams();

  const showModal = async () => {
    setVisible(true);
    const res = await getLearningStandard(learningStandard.id);
    setName(res.data.name);
    setDescription(res.data.expectations);
    setTeks(res.data.teks);
    setLink(res.data.link);
    setLinkError(false);
  };

  useEffect(() => {
    setDisplayName(learningStandard.name);
  }, [learningStandard.name]);

  const handleCancel = () => {
    setVisible(false);
  };

  const handleSubmit = async () => {
    if (link) {
      const goodLink = checkURL(link);
      if (!goodLink) {
        setLinkError(true);
        message.error('Please Enter a valid URL starting with HTTP/HTTPS', 4);
        return;
      }
    }
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
      setSearchParams({ tab, page, day: response.data.id });
      setViewing(response.data.id);
      setVisible(false);
    }
  };

  const checkURL = (n) => {
    const regex =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
    if (n.search(regex) === -1) {
      return null;
    }
    return n;
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
                setLinkError(false);
              }}
              style={linkError ? { backgroundColor: '#FFCCCC' } : {}}
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
