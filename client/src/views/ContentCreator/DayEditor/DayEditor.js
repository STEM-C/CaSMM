import React, { useState, useEffect } from 'react';
import { Button, List, Card, Modal, Form, message, Input } from 'antd';
import {
  createDay,
  getDay,
  deleteDay,
  getDayToolboxAll,
  getDayToolbox,
  updateDayDetails,
  getLearningStandardDays,
} from '../../../Utils/requests';
import './DayEditor.less';

const DayEditor = ({
  learningStandard,
  history,
  viewing,
  setViewing,
  page,
  tab,
}) => {
  const [visible, setVisible] = useState(false);
  const [dayDetailsVisible, setDayDetailsVisible] = useState(false);
  const [days, setDay] = useState([]);
  const [selectDay, setSelectDay] = useState('');
  const [description, setDescription] = useState('');
  const [TekS, setTekS] = useState('');
  const [link, setLink] = useState('');
  const [scienceObj, setScienceObj] = useState('');
  const [makingObj, setMakingObj] = useState('');
  const [computationObj, setComputationObj] = useState('');
  const [linkError, setLinkError] = useState(false);
  const [submitButton, setSubmitButton] = useState(0);

  const showDayDetailsModal = async (dayObj) => {
    const response = await getDay(dayObj.id);
    if (response.err) {
      message.error(response.err);
      return;
    }
    setDayDetailsVisible(true);
    setSelectDay(response.data);
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

  useEffect(() => {
    const getSavedDay = async () => {
      if (viewing && viewing === learningStandard.id) {
        const getDayAll = await getLearningStandardDays(viewing);
        const myDays = getDayAll.data;
        myDays.sort((a, b) => (a.number > b.number ? 1 : -1));
        setDay([...myDays]);
        setVisible(true);
      }
    };
    getSavedDay();
  }, [viewing, learningStandard.id]);

  const addBasicDay = async () => {
    let newDay = 1;
    if (days.length !== 0) {
      newDay = parseInt(days[days.length - 1].number) + 1;
    }

    const response = await createDay(newDay, learningStandard.id);
    if (response.err) {
      message.error(response.err);
    }
    setDay([...days, response.data]);
  };

  const removeBasicDay = async (currDay) => {
    if (window.confirm(`Deleting Day ${currDay.number}`)) {
      const response = await deleteDay(currDay.id);
      if (response.err) {
        message.error(response.err);
      }

      const getDayAll = await getLearningStandardDays(learningStandard.id);
      if (getDayAll.err) {
        message.error(getDayAll.err);
      }
      setDay([...getDayAll.data]);
    }
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

  const handleCancel = () => {
    setVisible(false);
    setViewing(undefined);
    history.push(`#${tab}#${page}`);
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
      if (submitButton == 0) {
        const getDayAll = await getLearningStandardDays(viewing);
        const myDays = getDayAll.data;
        myDays.sort((a, b) => (a.number > b.number ? 1 : -1));
        setDay([...myDays]);
        // save the form and go to workspace
      } else if (submitButton == 1) {
        setDayDetailsVisible(false);
        handleViewDay(res.data);
      }
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
      <Modal
        title={learningStandard.name}
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        size='large'
      >
        <div className='list-position'>
          {days.length > 0 ? (
            <div>
              <h3>Click Day to edit day detail and workspace</h3>
              <List
                grid={{ gutter: 16, column: 3 }}
                style={{ marginTop: '2vh' }}
                dataSource={days}
                renderItem={(item) => (
                  <List.Item>
                    <Card
                      id='card-day'
                      key={item.id}
                      title={'Day ' + item.number}
                      hoverable='true'
                      style={item.description ? { background: '#a6ffb3' } : {}}
                      onClick={() => showDayDetailsModal(item)}
                    />
                    <span
                      className='delete-btn'
                      onClick={() => removeBasicDay(item)}
                    >
                      &times;
                    </span>
                  </List.Item>
                )}
              />
            </div>
          ) : null}
          <div>
            <Form
              id='add-day'
              wrapperCol={{
                span: 14,
              }}
              layout='horizontal'
              size='default'
            >
              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
                style={{ marginBottom: '0px' }}
              >
                <Button
                  onClick={addBasicDay}
                  type='primary'
                  size='large'
                  className='content-creator-button'
                >
                  Add Day
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
          </div>
        </div>
      </Modal>

      <Modal
        title='Selected Day Details Editor'
        visible={dayDetailsVisible}
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
      </Modal>
    </div>
  );
};

export default DayEditor;
