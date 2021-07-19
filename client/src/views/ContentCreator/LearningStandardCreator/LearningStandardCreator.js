import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Modal, message, List, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  createLearningStandard,
  createDay,
  getAllUnits,
} from '../../../Utils/requests';

import './LearningStandardCreator.less';

export default function LearningStandardCreator(props) {
  const [visible, setVisible] = useState(false);
  const [visibleSelectDay, setVisibleSelectDay] = useState(false);
  const [unitsMenu, setUnitsMenu] = useState([]);

  const defaultLearningObj = {
    learningName: '',
    learningdescrip: '',
    learningNum: '',
    learningStandUnit: '',
    learningNumOfDays: '',
    learningTeks: '',
  };

  const [learningObj, setLearnObj] = useState({ defaultLearningObj });

  useEffect(() => {
    getAllUnits().then((res) => {
      if (res.data) {
        setUnitsMenu(res.data);
        console.log('this is the Units menu', res.data);
      } else {
        message.error(res.err);
      }
    });
  }, []);

  const showModal = () => {
    setVisible(true);
  };

  const showSelectDayModal = () => {
    setVisibleSelectDay(true);
    handleCancel();
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleCancelSelectDay = () => {
    setVisibleSelectDay(false);
  };

  const completeLearningStandard = () => {
    setVisible(false);
  };

  const addButtonStyle = {
    background: '#F4F4F5',
    borderRadius: '20px',
    border: '2px solid #5BABDE',
    left: '500px',
  };

  const onclickhandler = async () => {
    console.log(learningObj.learningNum);
    if (
      learningObj.learningdescrip == null ||
      learningObj.learningName == null ||
      learningObj.learningNum == null ||
      learningObj.learningStandUnit == null ||
      learningObj.learningTeks == null ||
      learningObj.learningNumOfDays == null
    ) {
      message.error(`Please fill out all the required columns`);
      return;
    }
    if (
      !Number.isInteger(parseInt(learningObj.learningNum)) ||
      parseInt(learningObj.learningNum) <= 0
    ) {
      message.error(`Please input a correct Number`);
      return;
    }
    if (
      !Number.isInteger(parseInt(learningObj.learningNumOfDays)) ||
      parseInt(learningObj.learningNumOfDays) <= 0
    ) {
      message.error(`Please input a correct number of days`);
      return;
    }
    if (learningObj.learningStandUnit == null) {
      message.error(`Please select a correct unit`);
      return;
    }

    //(props.dataSource)
    const newArr = [];
    // const units1 = await getAllUnits()
    // //console.log(units1)
    // units1.data.forEach(element => {
    //    creaStandard(element,newArr)
    // });
    creaStandard(newArr);

    showSelectDayModal();
  };

  const setUnitsOption = () => {
    let options = [];
    for (let i = 0; i < unitsMenu.length; i++) {
      options.push(
        <option key={i + 1} value={unitsMenu[i].id}>
          {unitsMenu[i].name}
        </option>
      );
    }
    return options;
  };

  const creaStandard = async (newArr) => {
    // if(element.name === learningObj.learningStandUnit){
    //console.log(element)
    const learningStand = createLearningStandard(
      learningObj.learningdescrip,
      learningObj.learningName,
      learningObj.learningNum,
      learningObj.learningStandUnit,
      learningObj.learningTeks
    );
    const getLearn = await learningStand;
    console.log('got from adding a learning standard', getLearn);
    for (let i = 0; i < learningObj.learningNumOfDays; i++) {
      await createDay(i + 1, getLearn.data);
    }
    newArr.push({
      name: getLearn.data.name,
      unit: getLearn.data.unit.name,
      description:
        getLearn.data.expectations.length > 5
          ? getLearn.data.expectations.substring(0, 30) + '...'
          : getLearn.data.expectations,
      view: getLearn.data.id,
      edit: getLearn.data.id,
      id: getLearn.data.id,
      delete: getLearn.data.id,
    });
    props.changeDataSource(newArr);
    setLearnObj(defaultLearningObj);

    completeLearningStandard();
    // }
    // else{
    //     const val = {
    //             unitName: "None",
    //             unitGrade: 3,
    //             // unitNumber: 0,
    //             unitDescrip: "None",
    //             unitTeksId: 0,
    //     }
    //     const learningStand = createLearningStandard(learningObj.learningdescrip,learningObj.learningName,learningObj.learningNum,val)
    //         const getLearn = await learningStand;
    //         console.log(getLearn)
    //         for(var i=0;i<learningObj.learningNumOfDays;i++){
    //             const var1 = createDay(i+1,getLearn.data)
    //             const var2 = await var1
    //         }
    //         newArr.push( { name:getLearn.data.name,
    //             unit:getLearn.data.unit.name,
    //             description:getLearn.data.expectations.length> 5 ? getLearn.data.expectations.substring(0,30) + "...": getLearn.data.expectations,
    //             view: getLearn.data.id,
    //             edit: getLearn.data.id,
    //             delete: getLearn.data.id})
    //         props.changeDataSource(newArr)
    // }
  };

  const lsNameOnChange = (e) => {
    const { value } = e.target;
    setLearnObj((learningObj) => ({
      ...learningObj,
      learningName: value,
    }));
  };

  const lsNumberOnChange = (e) => {
    const { value } = e.target;
    setLearnObj((learningObj) => ({
      ...learningObj,
      learningNum: value,
    }));
  };

  const lsDescriptionOnChange = (e) => {
    const { value } = e.target;
    setLearnObj((learningObj) => ({
      ...learningObj,
      learningdescrip: value,
    }));
  };

  const lsTeksOnChange = (e) => {
    const { value } = e.target;
    setLearnObj((learningObj) => ({
      ...learningObj,
      learningTeks: value,
    }));
  };

  const lsNoOfDaysOnChange = (e) => {
    const { value } = e.target;
    setLearnObj((learningObj) => ({
      ...learningObj,
      learningNumOfDays: value,
    }));
  };

  const lsUnitsOnChange = (e) => {
    const { value } = e.target;
    setLearnObj((learningObj) => ({
      ...learningObj,
      learningStandUnit: value,
    }));
  };

  return (
    <div>
      {/* <Button style={addButtonStyle} onClick={showModal}  icon={<PlusOutlined/>}>
                Add Learning Standard
            </Button> */}
      <button onClick={showModal} id='add-learning-standard-btn'>
        + Add a Lesson
      </button>
      <Modal
        title='Create a Lesson'
        visible={visible}
        onCancel={handleCancel}
        onOk={onclickhandler}
        // footer={[
        //     <Button onClick={handleCancel}>Cancel</Button>,
        //     <Button type="primary" onClick={onclickhandler}>Next</Button>
        // ]}
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
              defaultValue={learningObj.learningStandUnit}
              onChange={lsUnitsOnChange}
            >
              <option
                key={0}
                value={learningObj.learningStandUnit}
                id='disabled-option'
              >
                Units
              </option>
              {setUnitsOption().map((option) => option)}
            </select>
          </Form.Item>
          <Form.Item label='Lesson Name'>
            <Input onChange={lsNameOnChange} value={learningObj.learningName} />
          </Form.Item>
          <Form.Item label='Number'>
            <Input
              onChange={lsNumberOnChange}
              value={learningObj.learningNum}
            />
          </Form.Item>
          <Form.Item label='Number of Days'>
            <Input
              onChange={lsNoOfDaysOnChange}
              value={learningObj.learningNumOfDays}
            />
          </Form.Item>
          <Form.Item label='Description'>
            <Input
              onChange={lsDescriptionOnChange}
              value={learningObj.learningdescrip}
            />
          </Form.Item>
          <Form.Item label='Teks'>
            <Input onChange={lsTeksOnChange} value={learningObj.learningTeks} />
          </Form.Item>
        </Form>
      </Modal>

      {/*        <Modal
                title="Select a Day"
                visible={visibleSelectDay}
                footer={[
                    <Button onClick={handleCancelSelectDay}>Cancel</Button>,
                    <Button type="primary">Next</Button>
                ]}
                >
                    <div className="list-position">
                    {(learningObj.length > 0) ?
                        <List
                            grid={{ gutter: 16, column: 3 }}
                            renderItem={item => (
                                <List.Item >
                                        <Card id="card-day" key={item.id} title={"Day " + item.number } hoverable="true"
                                            //  onClick={() => handleViewDay(item)} 
                                             />
                                        {// <span className="delete-btn" onClick={() => removeBasicDay(item)}>&times;</span> 
                                        }
                                </List.Item>
                            )}
                        /> : null}
                    <div></div>
                    </div>

                                    </Modal> */}
    </div>
  );
}
