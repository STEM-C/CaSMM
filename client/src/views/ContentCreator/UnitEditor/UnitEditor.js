import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, message } from 'antd';
import { getLearningStandard, updateUnit } from '../../../Utils/requests';

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
    // console.log(returnUnit)
    setUnitObject({
      unitName: returnUnit.data.unit.name,
      unitNumber: returnUnit.data.unit.number,
      unitGrade: returnUnit.data.unit.grade,
      unitDescrip: returnUnit.data.unit.teks_description,
      unitTeksId: returnUnit.data.unit.teks_id,
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
        title='Unit Creator'
        visible={visible}
        onCancel={handleCancel}
        onOk={handleSubmit}
      >
        <Form
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout='horizontal'
          size='default'
        >
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
          <Form.Item
            label='Number'
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
