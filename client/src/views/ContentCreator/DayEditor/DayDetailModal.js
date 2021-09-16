import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, message, Input } from 'antd';
import {
  getDay,
  getDayToolboxAll,
  getDayToolbox,
  updateDayDetails,
  getLearningStandardDays,
} from '../../../Utils/requests';
import DayComponentTags from './DayComponentTags';
import './DayEditor.less';

const DayDetailModal = ({
  learningStandard,
  selectDay,
  setDayDetailsVisible,
  setDays,
  viewing,
  history,
}) => {
  const [description, setDescription] = useState('');
  const [TekS, setTekS] = useState('');
  const [link, setLink] = useState('');
  const [scienceObj, setScienceObj] = useState('');
  const [makingObj, setMakingObj] = useState('');
  const [computationObj, setComputationObj] = useState('');
  const [linkError, setLinkError] = useState(false);
  const [submitButton, setSubmitButton] = useState(0);

  useEffect(() => {
    const showDayDetailsModal = async () => {
      const response = await getDay(selectDay.id);
      if (response.err) {
        message.error(response.err);
        return;
      }
      setDescription(response.data.description);
      setTekS(response.data.TekS);
      setLink(response.data.link);
      setLinkError(false);
      const learningComponents = response.data.objectives;
      setScienceObj(
        learningComponents[0] ? learningComponents[0].description : ''
      );
      setMakingObj(
        learningComponents[1] ? learningComponents[1].description : ''
      );
      setComputationObj(
        learningComponents[2] ? learningComponents[2].description : ''
      );
    };
    showDayDetailsModal();
  }, [selectDay]);

  const checkURL = (n) => {
    const regex =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
    if (n.search(regex) === -1) {
      return null;
    }
    return n;
  };

  const handleViewDay = async (day) => {
    const allToolBoxRes = await getDayToolboxAll();
    const selectedToolBoxRes = await getDayToolbox(day.id);
    day.selectedToolbox = selectedToolBoxRes.data.toolbox;
    day.toolbox = allToolBoxRes.data.toolbox;

    day.learning_standard_name = learningStandard.name;
    localStorage.setItem('my-day', JSON.stringify(day));
    history.push('/day');
  };

  const handleSave = async () => {
    if (link) {
      const goodLink = checkURL(link);
      if (!goodLink) {
        setLinkError(true);
        message.error('Please Enter a valid URL starting with HTTP/HTTPS', 4);
        return;
      }
    }
    setLinkError(false);
    const res = await updateDayDetails(
      selectDay.id,
      description,
      TekS,
      link,
      scienceObj,
      makingObj,
      computationObj
    );
    if (res.err) {
      message.error(res.err);
    } else {
      message.success('Successfully saved day');
      // just save the form
      if (submitButton === 0) {
        const getDayAll = await getLearningStandardDays(viewing);
        const myDays = getDayAll.data;
        myDays.sort((a, b) => (a.number > b.number ? 1 : -1));
        setDays([...myDays]);
        // save the form and go to workspace
      } else if (submitButton === 1) {
        setDayDetailsVisible(false);
        handleViewDay(res.data);
      }
    }
  };

  return (
    <Modal
      title='Selected Day Details Editor'
      visible={true}
      onCancel={() => setDayDetailsVisible(false)}
      footer={null}
      width='35vw'
    >
      <Form
        id='add-units'
        layout='horizontal'
        size='default'
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 14,
        }}
        onFinish={handleSave}
      >
        <Form.Item id='form-label' label='Description'>
          <Input.TextArea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
            placeholder='Enter description'
          ></Input.TextArea>
        </Form.Item>
        <Form.Item id='form-label' label='TekS'>
          <Input
            onChange={(e) => setTekS(e.target.value)}
            value={TekS}
            required
            placeholder='Enter tekS'
          ></Input>
        </Form.Item>
        <h3>Lesson Learning Components</h3>
        <Form.Item id='form-label' label='Science Component'>
          <Input.TextArea
            onChange={(e) => setScienceObj(e.target.value)}
            value={scienceObj}
            required
            placeholder='Enter science component'
          ></Input.TextArea>
        </Form.Item>
        <Form.Item id='form-label' label='Maker Component'>
          <Input.TextArea
            onChange={(e) => setMakingObj(e.target.value)}
            value={makingObj}
            required
            placeholder='Enter maker component'
          ></Input.TextArea>
        </Form.Item>
        <Form.Item id='form-label' label='Computer Science Component'>
          <Input.TextArea
            onChange={(e) => setComputationObj(e.target.value)}
            value={computationObj}
            required
            placeholder='Enter computer science component'
          ></Input.TextArea>
        </Form.Item>
        <h3>Additional Information</h3>
        <Form.Item
          id='form-label'
          label='Link to Additional Resources (Optional)'
        >
          <Input
            onChange={(e) => {
              setLink(e.target.value);
              setLinkError(false);
            }}
            value={link}
            style={linkError ? { backgroundColor: '#FFCCCC' } : {}}
            placeholder='Enter a link'
          ></Input>
        </Form.Item>
        <Form.Item
          id='form-label'
          wrapperCol={{
            offset: 0,
            span: 25,
          }}
        >
          <Button
            type='primary'
            style={{ width: '100%', height: '5vh' }}
            htmlType='submit'
            size='large'
            onClick={() => setSubmitButton(1)}
          >
            Save and go to Workspace
          </Button>
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
          style={{ marginBottom: '0px' }}
        >
          <Button
            onClick={() => setSubmitButton(0)}
            type='primary'
            htmlType='submit'
            size='large'
            className='content-creator-button'
          >
            Save
          </Button>
          <Button
            onClick={() => setDayDetailsVisible(false)}
            size='large'
            className='content-creator-button'
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
      <DayComponentTags />
    </Modal>
  );
};

export default DayDetailModal;
