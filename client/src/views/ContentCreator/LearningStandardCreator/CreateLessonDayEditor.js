import React, { useState, useEffect } from 'react';
import { Button, List, Card, Modal, Form, message } from 'antd';
import {
  getDayToolboxAll,
  getDayToolbox,
  getLearningStandard,
} from '../../../Utils/requests';

export default function ContentCreator({ learningStandard, history }) {
  const [visible, setVisible] = useState(true);
  const [days, setDay] = useState([]);

  const handleCancel = () => {
    setVisible(false);
  };

  const showModal = async () => {
    const lsResponse = await getLearningStandard(learningStandard.id);
    const myDays = lsResponse.data.days;
    myDays.sort((a, b) => (a.number > b.number ? 1 : -1));
    setDay([...myDays]);
    //setVisible(true);
  };
  
  useEffect(() => {
    // console.log(learningStandard);
    // const lsResponse = getLearningStandard(learningStandard.id);
    // console.log(lsResponse);
    // console.log(lsResponse.data);
    // const myDays = lsResponse.data.days;
    // myDays.sort((a, b) => (a.number > b.number ? 1 : -1));
    // setDay([...myDays]);

    (async () => {
      const lsResponse = await getLearningStandard(learningStandard.id);
      const myDays = lsResponse.data.days;
      myDays.sort((a, b) => (a.number > b.number ? 1 : -1));
      setDay([...myDays]);
    })()
  }, []);


  const handleViewDay = async (day) => {
    const allToolBoxRes = await getDayToolboxAll();
    const selectedToolBoxRes = await getDayToolbox(day.id);
    day.selectedToolbox = selectedToolBoxRes.data.toolbox;
    day.toolbox = allToolBoxRes.data.toolbox;

    day.learning_standard_name = learningStandard.name;
    localStorage.setItem('my-day', JSON.stringify(day));
    history.push('/day');
  };

  return (
    <div>
      {/* <button id='link-btn' onClick={showModal}>
        {learningStandard.name}
      </button> */}

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
                    // onClick={() => removeBasicDay(item)}
                  >
                    &times;
                  </span>
                </List.Item>
              )}
            />
          ) : null}
          <div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
