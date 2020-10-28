import React,{useState} from 'react'
import {Form, Input, Button, Modal} from 'antd'
import {PlusOutlined} from '@ant-design/icons'
import {createUnit,createLearningStandard, createDay,getUnit, getUnits, getAllUnits} from '../../../Utils/requests'


import './LearningStandardCreator.less'

export default function LearningStandardCreator(props){

    const [visible, setVisible] = useState(false);
    const [numOfdays, setNumofDays] = useState(0);
   
    const [learningObj, setLearnObj] = useState({
    learningName: "",
    learningdescrip: 0,
    learningNum: 0,
    learningStandUnit: "",
    learningNumOfDays: 0,})


    const showModal = () => {
        setVisible(true)
    };

    const handleCancel = () => {
        setVisible(false)
    };


    const addButtonStyle={
        background: "#F4F4F5",
        borderRadius: "20px",
        border: "2px solid #5BABDE",
        left: '500px',
    }

     const onclickhandler= async()=>{
         //(props.dataSource)
        const newArr = []
        const units1 = await getAllUnits()
        //console.log(units1)
        units1.data.forEach(element => {
           creaStandard(element,newArr)
        });
       
        
        
    }

    const creaStandard = async(element,newArr)=>{
        // if(element.name === learningObj.learningStandUnit){
            //console.log(element)
                const learningStand = createLearningStandard(learningObj.learningdescrip,learningObj.learningName,learningObj.learningNum,element)
                const getLearn = await learningStand;
                console.log(getLearn)
                for(var i=0;i<learningObj.learningNumOfDays;i++){
                    const var1 = createDay(i+1,getLearn.data)
                    const var2 = await var1
                }
                newArr.push( { name:getLearn.data.name,
                    unit:getLearn.data.unit.name,
                    description:getLearn.data.expectations.length> 5 ? getLearn.data.expectations.substring(0,30) + "...": getLearn.data.expectations,
                    view: getLearn.data.id,
                    edit: getLearn.data.id,
                    delete: getLearn.data.id})
                props.changeDataSource(newArr)
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
    }

    return(
        <div>
            <Button style={addButtonStyle} onClick={showModal}  icon={<PlusOutlined/>}>
                Add Learning Standard
                </Button>
            <Modal
               title="Learning Standard Creator"
               visible={visible}
               onCancel={handleCancel}
            >
            <Form 
            labelCol={{
                span: 4
              }}
              wrapperCol={{
                span: 14
              }}
              layout="horizontal"
              size="default">
            <Form.Item label="Name">
                <Input onChange={(e)=>{ const {value} = e.target; setLearnObj((learningObj) => ({
                ...learningObj,
                learningName: value
                }));}}/>
            </Form.Item >
            <Form.Item label="Number"
            onChange={(e)=>{ const {value} = e.target; setLearnObj((learningObj) => ({
                ...learningObj,
                learningNum: parseInt(value,10)
             }));}}>
                <Input/>
            </Form.Item>
        
            <Form.Item label="Unit Name"
            onChange={(e)=>{ const {value} = e.target; setLearnObj((learningObj) => ({
                ...learningObj,
                learningStandUnit: value
             }));}}>
                <Input />
            </Form.Item>
            <Form.Item label="Description"
            onChange={(e)=>{ const {value} = e.target; setLearnObj((learningObj) => ({
                ...learningObj,
                learningdescrip: value
             }));}}>
                <Input />
            </Form.Item>
            <Form.Item label="TekS"
            >
                <Input />
            </Form.Item>
            <Form.Item label="NGSS"
           >
                <Input />
            </Form.Item>
            <Form.Item label="# of Days"
            onChange={(e)=>{ const {value} = e.target; setLearnObj((learningObj) => ({
                ...learningObj,
                learningNumOfDays: parseInt(value,10)
             }));}}>
                <Input />
            </Form.Item>
            

        <Form.Item>
            <Button type="primary" htmlType="submit" onClick={onclickhandler}>
            Create a Learning Standards
            </Button>
        </Form.Item>

        </Form>
    
        </Modal>

            
            </div>
    )
}