import React, { useState, useEffect } from 'react';
import { Button, List, Card, Modal, Form, Input } from 'antd';
import {
  getDayToolboxAll,
  getDayToolbox,
  getLearningStandard,
} from '../../../Utils/requests';
import FormItem from 'antd/lib/form/FormItem';

export default function ContentCreator({ learningStandard, history }) {
  const [visible, setVisible] = useState(true);
  const [dayDetailsVisible, setDayDetailsVisible] = useState(false);
  const [days, setDay] = useState([]);
  const [description, setDescription] = useState('');
  const [teks, setTeks] = useState('');
  const [scienceComponent, setScienceComponent] = useState('');
  const [makerComponent, setMakerComponent] = useState('');
  const [computerScienceComponent, setComputerScienceComponent] = useState('');

  const handleCancel = () => {
    setVisible(false);
  };

  const handleDayDetailsCancel = () => {
    setDayDetailsVisible(false);
    setVisible(true);
  };

  const showModal = async () => {
    const lsResponse = await getLearningStandard(learningStandard.id);
    const myDays = lsResponse.data.days;
    myDays.sort((a, b) => (a.number > b.number ? 1 : -1));
    setDay([...myDays]);
    //setVisible(true);
  };
  
  useEffect(() => {
    (async () => {
      const lsResponse = await getLearningStandard(learningStandard.id);
      const myDays = lsResponse.data.days;
      myDays.sort((a, b) => (a.number > b.number ? 1 : -1));
      setDay([...myDays]);
    })()
  }, []);

  const showAddDayDetailsModal = () => {
    setDayDetailsVisible(true);
  }

  // const onClickHandler = async (e) => {
  //   e.preventDefault();
  //   }
  // };

  return (
    <div>

      {
        visible? (
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
                      // onClick={() => handleViewDay(item)}
                      onClick={showAddDayDetailsModal}
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
        ) : (
          <div></div>
        )
      }

      {
        dayDetailsVisible ? (
          <Modal
            title="Add Selected Day Lesson Details"
            visible={dayDetailsVisible}
            onCancel={handleDayDetailsCancel}>
              <Form.Item label="Description">
                <Input
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  placeholder="Enter description">
                  </Input>
              </Form.Item>
              <Form.Item label="TekS">
                <Input
                  onChange={(e) => setTeks(e.target.value)}
                  value={teks}
                  placeholder="Enter tekS">
                  </Input>
              </Form.Item>

              <h3>Lesson Learning Components</h3>
              <Form.Item label="Science Component">
                <Input
                  onChange={(e) => setScienceComponent(e.target.value)}
                  value={scienceComponent}
                  placeholder="Enter science component">
                  </Input>
              </Form.Item>
              <Form.Item label="Maker Component">
                <Input
                  onChange={(e) => setMakerComponent(e.target.value)}
                  value={makerComponent}
                  placeholder="Enter maker component">
                  </Input>
              </Form.Item>
              <Form.Item label="Computer Science Component">
                <Input
                  onChange={(e) => setComputerScienceComponent(e.target.value)}
                  value={computerScienceComponent}
                  placeholder="Enter computer science component">
                  </Input>
              </Form.Item>

          </Modal>
        ) : (
          <div></div>
        )
      }
    
    </div>
  );
}
