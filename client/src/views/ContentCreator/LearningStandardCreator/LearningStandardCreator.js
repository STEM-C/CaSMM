import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, message, List, Card } from 'antd';
import {
  createLearningStandard,
  createDay,
  getAllUnits,
  getLearningStandardAll,
} from '../../../Utils/requests';

import './LearningStandardCreator.less';

export default function LearningStandardCreator({ setLearningStandardList }) {
  const [visible, setVisible] = useState(false);
  const [unitList, setUnitList] = useState([]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState('');
  const [numofDays, setNumofDays] = useState('');
  const [teks, setTeks] = useState('');

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
    setUnit('');
    setNumofDays('');
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onClickHandler = async (e) => {
    e.preventDefault();
    const res = await createLearningStandard(description, name, 0, unit, teks);
    if (res.err) {
      message.error('fail to create new learning standard');
    } else {
      for (let i = 1; i <= numofDays; i++) {
        const dayRes = await createDay(i, res.data);
        if (dayRes.err) {
          message.error('Fail to create days');
        }
      }
      message.success('Successfully created lesson');
      const lsRes = await getLearningStandardAll();
      // console.log(lsRes);
      setLearningStandardList(lsRes.data);

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
              <option key={0} value={unit} id='disabled-option'>
                Units
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
            <Input
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
        </Form>
      </Modal>
    </div>
  );
}
