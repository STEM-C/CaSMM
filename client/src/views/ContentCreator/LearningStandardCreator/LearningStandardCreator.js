import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, message } from 'antd';
import {
  createLearningStandard,
  createDay,
  getAllUnits,
  getLearningStandardAll,
} from '../../../Utils/requests';
import './LearningStandardCreator.less';
import DayEditor from '../DayEditor/DayEditor';

export default function LearningStandardCreator({
  setLearningStandardList,
  history,
  viewing,
  setViewing,
}) {
  const [visible, setVisible] = useState(false);
  const [unitList, setUnitList] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState('');
  const [numofDays, setNumofDays] = useState('');
  const [teks, setTeks] = useState('');
  const [link, setLink] = useState('');
  const [learningStandardObj, setLearningStandardObj] = useState('');

  useEffect(() => {
    const getUnits = async () => {
      const res = await getAllUnits();
      setUnitList(res.data);
    };
    getUnits();
  }, []);

  const showModal = async () => {
    const res = await getAllUnits();
    setUnitList(res.data);
    setDescription('');
    setName('');
    setTeks('');
    setLink('');
    setNumofDays('');
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onClickHandler = async (e) => {
    if (unit === '') {
      message.error('Please select unit');
      return;
    }
    e.preventDefault();
    const res = await createLearningStandard(
      description,
      name,
      0,
      unit,
      teks,
      link
    );
    if (res.err) {
      message.error('Fail to create new learning standard');
    } else {
      for (let i = 1; i <= numofDays; i++) {
        const dayRes = await createDay(i, res.data);
        if (dayRes.err) {
          message.error('Fail to create days');
        }
      }
      message.success('Successfully created lesson');
      const lsRes = await getLearningStandardAll();
      setLearningStandardList(lsRes.data);
      setLearningStandardObj(res.data);
      history.push(`#${res.data.id}`);
      setViewing(res.data.id);
      setVisible(false);
    }
  };

  return (
    <div>
      <button onClick={showModal} id='add-learning-standard-btn'>
        + Add a Lesson
      </button>

      <Modal
        title='Create a Lesson'
        visible={visible}
        onCancel={handleCancel}
        onOk={onClickHandler}
      >
        <Form
          id='add-learning-standard'
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout='horizontal'
          size='default'
        >
          <Form.Item label='Unit Name'>
            <select
              id='unit-name-dropdown'
              name='unit'
              defaultValue={unit}
              onChange={(e) => setUnit(e.target.value)}
            >
              <option key={0} value={unit} id='disabled-option' disabled>
                Unit
              </option>
              {unitList.map((unit_) => (
                <option key={unit_.id} value={unit_.id}>
                  {unit_.name}
                </option>
              ))}
            </select>
          </Form.Item>
          <Form.Item label='Lesson Name'>
            <Input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder='Enter lesson name'
            />
          </Form.Item>
          <Form.Item label='Number of Days'>
            <Input
              onChange={(e) => {
                setNumofDays(e.target.value);
              }}
              value={numofDays}
              placeholder='Enter number of days'
              type='number'
              min={1}
              max={10}
            />
          </Form.Item>
          <Form.Item label='Description'>
            <Input.TextArea
              rows={3}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              value={description}
              placeholder='Enter lesson description'
            />
          </Form.Item>
          <Form.Item label='Teks'>
            <Input
              onChange={(e) => {
                setTeks(e.target.value);
              }}
              value={teks}
              placeholder='Enter lesson Teks'
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
          learningStandard={learningStandardObj}
          viewing={viewing}
        />
      ) : null}
    </div>
  );
}
