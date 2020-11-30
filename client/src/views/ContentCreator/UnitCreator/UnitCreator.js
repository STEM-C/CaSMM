import React,{useState} from 'react'
import {Form, Input, Button, Modal} from 'antd'
import {PlusOutlined} from '@ant-design/icons'
import {createUnit,createLearningStandard, createDay,getUnit} from '../../../Utils/requests'


import './UnitCreator.less'

export default function UnitCreator(props){

    const [visible, setVisible] = useState(false);
    const [numOfdays, setNumofDays] = useState(0);
    const unitDefaultState = {
        unitName: "",
        unitGrade: "",
        unitNumber: "",
        unitDescrip: "",
        unitTeksId: "",}

    const [unitObject, setUnitObject] = useState(unitDefaultState)

    const [learningstandObj, setStandObj]= useState({
        learningStandName:"",
        learningStandDescrip:"",
        learningStandNumber: 0
    })
    
    const [learningStandObjs, setLearningStandard] = useState([])

    const showModal = () => {
        setVisible(true)
    };

    const handleCancel = () => {
        setVisible(false)
    };

    const completeUnitCreation = () => {
        setVisible(false)
    }
    
    const addButtonStyle={
        background: "#F4F4F5",
        borderRadius: "20px",
        border: "2px solid #5BABDE",
        left: '500px',
    }
    const handleChange =(e,index,switchval)=>{
        const {value} = e.target;
        //let newArr = [...learningStandObjs];
        switch(switchval){
            case 1:
                learningStandObjs[index.key].learningStandName = value;
                break;
            case 2:
                learningStandObjs[index.key].learningStandDescrip = value;
                break;

            case 3:
                learningStandObjs[index.key].learningStandNumber = parseFloat(value);
                break;
            default:
                break;
        }
        //setLearningStandard(newArr) ;
       
    }

     const onclickhandler= async()=>{
        //console.log(getLearningStandard(1))
        console.log(unitObject)
      
        const creatunit = createUnit(unitObject.unitNumber,unitObject.unitName,unitObject.unitTeksId,unitObject.unitDescrip,unitObject.unitGrade)
        const unitReponse = await creatunit
        // const getUnitreponse = getUnit(unitReponse.data.id)
        // const unit = await getUnitreponse
        // const newArr = [...props.datasource]
        // learningStandObjs.map(each=>{
        //     creatLeanrAndDays(each,unit,newArr)
          
        // })
        //setUnitObject()
        setUnitObject({...unitDefaultState})
        completeUnitCreation()
    }

    const creatLeanrAndDays = async(each,unit,newArr)=>{
        const learningStand = createLearningStandard(each.learningStandDescrip,each.learningStandName,each.learningStandNumber,unit.data)
        const getLearn = await learningStand;
        newArr.push( { name:getLearn.data.name,
            unit:getLearn.data.unit.name,
            description:getLearn.data.expectations.length> 5 ? getLearn.data.expectations.substring(0,30) + "...": getLearn.data.expectations,
            view: getLearn.data.id,
            edit: getLearn.data.id,
            delete: getLearn.data.id})
        // props.changeDataSource({
        //     name:getLearn.data.name,
        //     unit:getLearn.data.unit.name,
        //     description:getLearn.data.expectations.length> 5 ? getLearn.data.expectations.substring(0,30) + "...": getLearn.data.expectations,
        //     view: getLearn.data.id,
        //     edit: getLearn.data.id,
        //     delete: getLearn.data.id
        // })
        props.changeDataSource(newArr)
          for(var i=0;i<numOfdays;i++){
                createDay(i+1,getLearn.data)
            }
    }



    // const unitNameOnChange = (e) => {
    //     e.preventDefault()
    //     const target = event.target
    //     const input = target.value
    //     const name = target.name
    //     setVisible(false)
    // }

    const unitNameOnChange = (e) => { 
        const {value} = e.target; 
        setUnitObject((unitObject) => ({
        ...unitObject,
        unitName: value
        }));
    }
    
    const unitGradeOnChange = (e) => {
        const {value} = e.target; 
        setUnitObject((unitObject) => ({
            ...unitObject,
            unitGrade: value
         }));
    }
    

    const unitNumberOnChange = (e) => {  
        const {value} = e.target; 
        setUnitObject((unitObject) => ({
            ...unitObject,
            unitNumber: value
        }));
    }
    
    const unitDescripOnChange = (e) => { 
        const {value} = e.target; 
        setUnitObject((unitObject) => ({
            ...unitObject,
            unitDescrip: value
        }));
    }

    const unitTeksIdOnChange = (e) => {
        const {value} = e.target; setUnitObject((unitObject) => ({
            ...unitObject,
            unitTeksId: value
         }));
    }
    
    
    return(
        <div>
            <Button style={addButtonStyle} onClick={showModal}  icon={<PlusOutlined/>}>
                Add Unit
                </Button>
            <Modal
               title="Unit Creator"
               visible={visible}
               onCancel={handleCancel}
               onOk={onclickhandler}
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
            <Form.Item label="Unit Name">
                <Input onChange={unitNameOnChange} value ={unitObject.unitName}/>
            </Form.Item >
            <Form.Item label="Grade">
                <Input onChange={unitGradeOnChange} value = {unitObject.unitGrade} />
            </Form.Item>
            <Form.Item label="Number">
                <Input onChange={unitNumberOnChange} value = {unitObject.unitNumber}/>
            </Form.Item>
            <Form.Item label="Description">
                <Input onChange={unitDescripOnChange} value = {unitObject.unitDescrip}/>
            </Form.Item>
            <Form.Item label="TekS">
                <Input onChange={unitTeksIdOnChange} value = {unitObject.unitTeksId}/>
            </Form.Item>
            {/* <div>Learning Standards</div>
            <Form.List name="names">
        {(fields, { add, remove }) => {
            return(
                <div>
                    {fields.map((index) =>(
                        <div>
                            <Form layout="inline" size="small">
                            <Form.Item layout="inline" size="small" label="Name"
                            onChange={(e)=>{handleChange(e,index,1)}}><Input/></Form.Item>
                            <Form.Item layout="inline" size="small" label="Description"
                            onChange={(e)=>{handleChange(e,index,2)}}><Input/></Form.Item>
                            <Form.Item layout="inline" size="small" label="Number"
                            onChange={(e)=>{handleChange(e,index,3)}}><Input/></Form.Item>
                        </Form>
                        </div>
                    ))
                    },
            <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                    setLearningStandard([...learningStandObjs,
                        {learningStandName: learningstandObj.learningStandName,learningStandNumber: learningstandObj.learningStandNumber, learningStandDescrip: learningstandObj.learningStandDescrip}])
                  }}
                  style={{ width: '60%' }}
                >
                  <PlusOutlined /> 
                </Button>
            </Form.Item>
            </div>
            )
        }}

        
         
        </Form.List>
        <Form.Item layout="vertical" size="small" label="# of Days"
        onChange={(e)=>{ const {value} = e.target; setNumofDays(value);}}>
                <Input/>
        </Form.Item> */}

        {/* <Form.Item>
            <Button type="primary" htmlType="submit" onClick={onclickhandler}>
            Create a Unit
            </Button>
        </Form.Item> */}

        </Form>
    
        </Modal>

            
            </div>
    )
}