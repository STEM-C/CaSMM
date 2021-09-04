import React, { useState, useEffect } from 'react';
import { Button, List, Card, Modal, Form, Input } from 'antd';
import {
  getDayToolboxAll,
  getDayToolbox,
  getLearningStandard,
} from '../../../Utils/requests';
import './CreateLessonDayEditor.less'

export default function ContentCreator({ learningStandard, history, createLessonDayEditorVisible }) {
  const [visible, setVisible] = useState(false);
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
  };


  useEffect(() => {
    (async () => {
      const lsResponse = await getLearningStandard(learningStandard.id);
      const myDays = lsResponse.data.days;
      myDays.sort((a, b) => (a.number > b.number ? 1 : -1));
      setDay([...myDays]);
      setVisible(createLessonDayEditorVisible);
    })()
  }, []);

  const showAddDayDetailsModal = () => {
    setDayDetailsVisible(true);
    setDescription('');
    setTeks('');
    setScienceComponent('');
    setMakerComponent('');
    setComputerScienceComponent('');
  }

  // const onClickHandler = async (e) => {
  //   e.preventDefault();
  //   }
  // };

  const onClickHandler = () => {
    setVisible(false);
  }

  return (
    <div>

        <Modal
          title={learningStandard.name}
          visible={visible}
          onCancel={handleCancel}
          onOk={onClickHandler}
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
        
          <Modal
            title="Add Selected Day Lesson Details"
            visible={dayDetailsVisible}
            onCancel={handleDayDetailsCancel}>
              <Form
                id='add-day-details'
                // labelCol={{
                //   span: 8,
                // }}
                // wrapperCol={{
                //   span: 14,
                // }}
                layout='horizontal'
                size='default'
                >
                  <Form.Item id='form-label' label="Description">
                    <Input.TextArea
                      onChange={(e) => setDescription(e.target.value)}
                      value={description}
                      placeholder="Enter description">
                      </Input.TextArea>
                  </Form.Item>
                  <Form.Item id='form-label' label="TekS">
                    <Input
                      onChange={(e) => setTeks(e.target.value)}
                      value={teks}
                      placeholder="Enter tekS">
                      </Input>
                  </Form.Item>

                  <h3>Lesson Learning Components</h3>
                  <Form.Item id='form-label' label="Science Component">
                    <Input.TextArea
                      onChange={(e) => setScienceComponent(e.target.value)}
                      value={scienceComponent}
                      placeholder="Enter science component">
                      </Input.TextArea>
                  </Form.Item>
                  <Form.Item id='form-label' label="Maker Component">
                    <Input.TextArea
                      onChange={(e) => setMakerComponent(e.target.value)}
                      value={makerComponent}
                      placeholder="Enter maker component">
                      </Input.TextArea>
                  </Form.Item>
                  <Form.Item id='form-label' label="Computer Science Component">
                    <Input.TextArea
                      onChange={(e) => setComputerScienceComponent(e.target.value)}
                      value={computerScienceComponent}
                      placeholder="Enter computer science component">
                      </Input.TextArea>
                  </Form.Item>
              </Form>
          </Modal>
   
    
    </div>
  );
}
