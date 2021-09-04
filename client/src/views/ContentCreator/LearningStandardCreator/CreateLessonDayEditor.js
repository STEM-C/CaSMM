import React, { useState, useEffect } from 'react';
import { Button, List, Card, Modal, Form, Input, message } from 'antd';
import {
  getDayToolboxAll,
  getDayToolbox,
  getLearningStandard,
  updateDayDetails,
} from '../../../Utils/requests';
import './CreateLessonDayEditor.less'

export default function CreateLessonDayEditor({ learningStandard, history, createLessonDayEditorVisible }) {
  const [visible, setVisible] = useState(false);
  const [dayDetailsVisible, setDayDetailsVisible] = useState(false);
  const [dayToolbox, setDayToolbox] = useState('');
  const [days, setDay] = useState([]);
  const [dayId, setDayId] = useState('');
  const [description, setDescription] = useState('');
  const [TekS, setTekS] = useState('');
  const [scienceObj, setScienceObj] = useState('');
  const [makingObj, setMakingObj] = useState('');
  const [ComputationObj, setComputationObj] = useState('');

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
      console.log(days);
    })()
  }, []);

  const showAddDayDetailsModal = (dayObj) => {
    setDayDetailsVisible(true);
    setDayId(dayObj.id);
    setDayToolbox(dayObj);

    setDescription('');
    setTekS('');
    setScienceObj('');
    setMakingObj('');
    setComputationObj('');
  }

  const onClickHandler = async (e) => {
    e.preventDefault();
    const res = await updateDayDetails(dayId, description, TekS, scienceObj, makingObj, ComputationObj);
    console.log(res);
    setDayDetailsVisible(false);
    handleViewDay(dayToolbox);
  };

  const handleViewDay = async (day) => {
    const allToolBoxRes = await getDayToolboxAll();
    const selectedToolBoxRes = await getDayToolbox(day.id);
    day.selectedToolbox = selectedToolBoxRes.data.toolbox;
    day.toolbox = allToolBoxRes.data.toolbox;

    day.learning_standard_name = learningStandard.name;
    localStorage.setItem('my-day', JSON.stringify(day));
    console.log('works');
    history.push('/day');
  };

  return (
    <div>

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
                      onClick={() => {
                        showAddDayDetailsModal(item);
                      }}
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
            onCancel={handleDayDetailsCancel}
            onOk={onClickHandler}>
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
                      onChange={(e) => setTekS(e.target.value)}
                      value={TekS}
                      placeholder="Enter tekS">
                      </Input>
                  </Form.Item>

                  <h3>Lesson Learning Components</h3>
                  <Form.Item id='form-label' label="Science Component">
                    <Input.TextArea
                      onChange={(e) => setScienceObj(e.target.value)}
                      value={scienceObj}
                      placeholder="Enter science component">
                      </Input.TextArea>
                  </Form.Item>
                  <Form.Item id='form-label' label="Maker Component">
                    <Input.TextArea
                      onChange={(e) => setMakingObj(e.target.value)}
                      value={makingObj}
                      placeholder="Enter maker component">
                      </Input.TextArea>
                  </Form.Item>
                  <Form.Item id='form-label' label="Computer Science Component">
                    <Input.TextArea
                      onChange={(e) => setComputationObj(e.target.value)}
                      value={ComputationObj}
                      placeholder="Enter computer science component">
                      </Input.TextArea>
                  </Form.Item>
              </Form>
          </Modal>
   
    </div>
  );
}
