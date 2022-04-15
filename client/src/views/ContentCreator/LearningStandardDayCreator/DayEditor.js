import React, { useState } from 'react';
import { Button, List, Card, Modal, Form, message } from 'antd';
import {
  createDay,
  deleteDay,
  getDayToolboxAll,
  getDayToolbox,
  getLearningStandard,
} from '../../../Utils/requests';
import './DayEditor.less';
import { useNavigate } from 'react-router-dom';

export default function ContentCreator({ learningStandard }) {
  const [visible, setVisible] = useState(false);
  const [days, setDay] = useState([]);

  const navigate = useNavigate();

  const handleCancel = () => {
    setVisible(false);
  };

  const showModal = async () => {
    const lsResponse = await getLearningStandard(learningStandard.id);
    const myDays = lsResponse.data.days;
    myDays.sort((a, b) => (a.number > b.number ? 1 : -1));
    setDay([...myDays]);
    setVisible(true);
  };

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

      const lsResponse = await getLearningStandard(learningStandard.id);
      if (lsResponse.err) {
        message.error(lsResponse.err);
      }
      setDay([...lsResponse.data.days]);
    }
  };

  const handleViewDay = async (day) => {
    const allToolBoxRes = await getDayToolboxAll();
    const selectedToolBoxRes = await getDayToolbox(day.id);
    day.selectedToolbox = selectedToolBoxRes.data.toolbox;
    day.toolbox = allToolBoxRes.data.toolbox;

    day.learning_standard_name = learningStandard.name;
    localStorage.setItem('my-day', JSON.stringify(day));
    navigate('/day');
  };

  return (
    <div>
      <button id='link-btn' onClick={showModal}>
        {learningStandard.name}
      </button>

      <Modal
        title={learningStandard.name}
        visible={visible}
        onCancel={handleCancel}
        onOk={handleCancel}
        size='large'
      >
        <div className='list-position'>
          {days.length > 0 ? (
            <List
              grid={{ gutter: 16, column: 3 }}
              dataSource={days}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    id='card-day'
                    key={item.id}
                    title={'Day ' + item.number}
                    hoverable='true'
                    onClick={() => handleViewDay(item)}
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
              <Button onClick={addBasicDay} type='primary'>
                Add Day
              </Button>
            </Form>
          </div>
        </div>
      </Modal>
    </div>
  );
}
