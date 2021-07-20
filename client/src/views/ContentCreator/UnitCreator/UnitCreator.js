import React, { useState } from 'react';
import { Form, Input, Modal, message } from 'antd';
import { createUnit } from '../../../Utils/requests';
import './UnitCreator.less';

export default function UnitCreator({ gradeList }) {
  const [visible, setVisible] = useState(false);
  const [grade, setGrade] = useState('');
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [description, setDescription] = useState('');
  const [tek, setTek] = useState('');

  const showModal = () => {
    setGrade('');
    setNumber('');
    setName('');
    setDescription('');
    setTek('');
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onClickHandler = async (e) => {
    e.preventDefault();
    const res = await createUnit(number, name, tek, description, grade);
    console.log(res);
    if (res.err) {
      message.error('Fail to create a new unit');
    } else {
      message.success('Successfully created unit');
      setVisible(false);
    }
  };

  return (
    <div>
      <button onClick={showModal} id='add-unit-btn'>
        + Add Unit
      </button>
      <Modal
        title='Create Unit'
        visible={visible}
        onCancel={handleCancel}
        onOk={onClickHandler}
      >
        <Form
          id='add-units'
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout='horizontal'
          size='default'
        >
          <Form.Item id='form-label' label='Grade'>
            <select
              id='grade-dropdown'
              name='grade'
              defaultValue={grade}
              onChange={(e) => setGrade(e.target.value)}
            >
              <option key={0} value={grade} disabled id='disabled-option'>
                Grade
              </option>
              {gradeList.map((grade_) => (
                <option key={grade_.id} value={grade_.id}>
                  {grade_.name}
                </option>
              ))}
            </select>
          </Form.Item>
          <Form.Item id='form-label' label='Unit Name'>
            <Input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder='Enter unit name'
            />
          </Form.Item>
          <Form.Item id='form-label' label='Unit Number'>
            <Input
              onChange={(e) => setNumber(e.target.value)}
              type='number'
              value={number}
              placeholder='Enter unit number'
              min={1}
              max={15}
            />
          </Form.Item>
          <Form.Item id='form-label' label='Description'>
            <Input
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              placeholder='Enter unit description'
            />
          </Form.Item>
          <Form.Item id='form-label' label='TekS'>
            <Input
              onChange={(e) => setTek(e.target.value)}
              value={tek}
              placeholder='Enter unit Teks'
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
