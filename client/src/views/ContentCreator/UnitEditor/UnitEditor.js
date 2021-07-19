import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, message } from 'antd';
import {
  getLearningStandard,
  updateUnit,
  getGrade,
} from '../../../Utils/requests';

import './UnitEditor.less';

export default function UnitCreator(props) {
  const [unitObject, setUnitObject] = useState({
    unitName: '',
    unitGrade: 0,
    unitNumber: 0,
    unitDescrip: '',
    unitTeksId: 0,
  });
  const [unitId, setUnitId] = useState(0);

  useEffect(() => {
    getUnit();
    // eslint-disable-next-line
  }, []);
  const [visible, setVisible] = useState(false);
  const linkBtn = props.linkBtn;

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const getUnit = async () => {
    const learningStand = getLearningStandard(props.learningStandard);
    const returnUnit = await learningStand;

    const {
      name,
      number,
      grade,
      teks_description,
      teks_id,
    } = returnUnit.data.unit;

    const returnGrade = await getGrade(grade);
    const gradeNum = returnGrade.data.name;

    setUnitObject({
      unitName: name,
      unitNumber: number,
      unitGrade: gradeNum,
      unitDescrip: teks_description,
      unitTeksId: teks_id,
    });
    setUnitId(returnUnit.data.unit.id);
  };

  const handleSubmit = async () => {
    try {
      await updateUnit(
        unitId,
        unitObject.unitNumber,
        unitObject.unitName,
        unitObject.unitTeksId,
        unitObject.unitDescrip,
        unitObject.unitGrade
      );
      message.success('Update Unit Success');
      setVisible(false);
    } catch (error) {
      message.error(error);
      console.error(error);
    }
  };
  return (
    <div>
      <button id={linkBtn ? 'link-btn' : null} onClick={showModal}>
        {unitObject.unitName}
      </button>
      <Modal
        title='Unit Editor'
        visible={visible}
        onCancel={handleCancel}
        onOk={handleSubmit}
      >
        <Form
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout='horizontal'
          size='default'
        >
          <Form.Item
            label='Grade'
            onChange={(e) => {
              const { value } = e.target;
              setUnitObject((unitObject) => ({
                ...unitObject,
                unitGrade: parseInt(value, 10),
              }));
            }}
          >
            <Input defaultValue={unitObject.unitGrade} disabled />
          </Form.Item>
          <Form.Item label='Unit Name'>
            <Input
              defaultValue={unitObject.unitName}
              onChange={(e) => {
                const { value } = e.target;
                setUnitObject((unitObject) => ({
                  ...unitObject,
                  unitName: value,
                }));
              }}
            />
          </Form.Item>
          <Form.Item
            label='Unit Number'
            onChange={(e) => {
              const { value } = e.target;
              setUnitObject((unitObject) => ({
                ...unitObject,
                unitNumber: parseInt(value, 10),
              }));
            }}
          >
            <Input defaultValue={unitObject.unitNumber} />
          </Form.Item>
          <Form.Item
            label='Description'
            onChange={(e) => {
              const { value } = e.target;
              setUnitObject((unitObject) => ({
                ...unitObject,
                unitDescrip: value,
              }));
            }}
          >
            <Input defaultValue={unitObject.unitDescrip} />
          </Form.Item>
          <Form.Item
            label='TekS'
            onChange={(e) => {
              const { value } = e.target;
              setUnitObject((unitObject) => ({
                ...unitObject,
                unitTeksId: value,
              }));
            }}
          >
            <Input defaultValue={unitObject.unitTeksId} />
          </Form.Item>
          <Form.Item>
            {/* <Button type="primary" htmlType="submit">
                            Save Unit
                        </Button> */}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
