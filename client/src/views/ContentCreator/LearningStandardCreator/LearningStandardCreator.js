import React,{useState, useEffect} from 'react'
import {Form, Input, Button, Modal, message} from 'antd'
import {PlusOutlined} from '@ant-design/icons'
import {createLearningStandard, createDay, getAllUnits} from '../../../Utils/requests'


import './LearningStandardCreator.less'

export default function LearningStandardCreator(props){

    const [visible, setVisible] = useState(false);
    const [unitsMenu, setUnitsMenu] = useState([])

    const defaultLearningObj = {
        learningName: "",
        learningdescrip: "",
        learningNum: "",
        learningStandUnit: "",
        learningNumOfDays: "",
        learningTeks: ""
    }

    const [learningObj, setLearnObj] = useState({defaultLearningObj})

    useEffect(() => {

        getAllUnits().then(res => {
            if(res.data){
                setUnitsMenu(res.data)
                console.log("this is the Units menu", res.data)
            }else{
                message.error(res.err)
            }
        })
    }, [])


    const showModal = () => {
        setVisible(true)
    };

    const handleCancel = () => {
        setVisible(false)
    };

    const completeLearningStandard = () => {
        setVisible(false)
    }

    const addButtonStyle={
        background: "#F4F4F5",
        borderRadius: "20px",
        border: "2px solid #5BABDE",
        left: '500px',
    }

     const onclickhandler= async()=>{
         //(props.dataSource)
        const newArr = []
        // const units1 = await getAllUnits()
        // //console.log(units1)
        // units1.data.forEach(element => {
        //    creaStandard(element,newArr)
        // });
        creaStandard(newArr) 
       
    }

    const setUnitsOption = () => {
        let options = [];
        for(let i = 0; i < unitsMenu.length; i++){
            options.push(<option key={i+1} value={unitsMenu[i].id}>{unitsMenu[i].name}</option>)
        }
        return options
    };

    const creaStandard = async(newArr)=>{
        // if(element.name === learningObj.learningStandUnit){
            //console.log(element)
        const learningStand = createLearningStandard(learningObj.learningdescrip,learningObj.learningName,learningObj.learningNum,
            learningObj.learningStandUnit, learningObj.learningTeks)
        const getLearn = await learningStand;
        console.log("got from adding a learning standard", getLearn)
        for(let i=0;i<learningObj.learningNumOfDays;i++){
            await createDay(i+1,getLearn.data)
        }
        newArr.push( { name:getLearn.data.name,
            unit:getLearn.data.unit.name,
            description:getLearn.data.expectations.length> 5 ? getLearn.data.expectations.substring(0,30) + "...": getLearn.data.expectations,
            view: getLearn.data.id,
            edit: getLearn.data.id,
            id: getLearn.data.id,
            delete: getLearn.data.id})
        props.changeDataSource(newArr)

        setLearnObj(defaultLearningObj)

        completeLearningStandard()
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

    const lsNameOnChange = (e) => {
        const {value} = e.target; 
        setLearnObj((learningObj) => ({
            ...learningObj,
            learningName: value
        }));
    }
    

    const lsNumberOnChange = (e) => { 
        const {value} = e.target; 
        setLearnObj((learningObj) => ({
            ...learningObj,
            learningNum: parseInt(value,10)
        }));
    }

    const lsDescriptionOnChange = (e) => { 
        const {value} = e.target; 
        setLearnObj((learningObj) => ({
            ...learningObj,
            learningdescrip: value
        }));
    }

    const lsTeksOnChange = (e) => { 
        const {value} = e.target; 
        setLearnObj((learningObj) => ({
            ...learningObj,
            learningTeks: value
        }));
    }

    const lsNoOfDaysOnChange = (e) => { 
        const {value} = e.target; 
        setLearnObj((learningObj) => ({
            ...learningObj,
            learningNumOfDays: parseInt(value,10)
        }));
    }

    const lsUnitsOnChange = (e) => {
        const {value} = e.target; 
        setLearnObj((learningObj) => ({
            ...learningObj,
            learningStandUnit: value
         }));
    }


    return(
        <div>
            <Button style={addButtonStyle} onClick={showModal}  icon={<PlusOutlined/>}>
                Add Learning Standard
                </Button>
            <Modal
               title="Create Learning Standard"
               visible={visible}
               onCancel={handleCancel}
               onOk={onclickhandler}
            >
            <Form id="add-learning-standard"
            labelCol={{
                span: 4
              }}
              wrapperCol={{
                span: 14
              }}
              layout="horizontal"
              size="default">
            <Form.Item label="Name">
                <Input onChange={lsNameOnChange} value={learningObj.learningName} />
            </Form.Item >

            <Form.Item label="Number">
                <Input onChange={lsNumberOnChange} value={learningObj.learningNum}/>
            </Form.Item>
        
            <Form.Item label="Unit Name">
                <select id="unit" name='unit' defaultValue={learningObj.learningStandUnit} onChange={lsUnitsOnChange}>
                    <option key={0} value={learningObj.learningStandUnit} disabled id='disabled-option'>Units</option>
                    {setUnitsOption().map(option => option)}
                </select>
            </Form.Item>

            <Form.Item label="Description">
                <Input onChange={lsDescriptionOnChange} value={learningObj.learningdescrip}/>
            </Form.Item>

            <Form.Item label="Teks">
                <Input onChange={lsTeksOnChange} value={learningObj.learningTeks}/>
            </Form.Item>

            <Form.Item label="# of Days">
                <Input onChange={lsNoOfDaysOnChange} value={learningObj.learningNumOfDays}/>
            </Form.Item>



        </Form>
    
        </Modal>

            
        </div>
    )
}