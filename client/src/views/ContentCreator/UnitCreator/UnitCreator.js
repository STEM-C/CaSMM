import React,{useState} from 'react'
import {Form, Input, Button, Modal} from 'antd'
import {PlusOutlined} from '@ant-design/icons'
import {createUnit,createLearningStandard, createDay,getUnit} from '../../../Utils/requests'


import './UnitCreator.less'

export default function UnitCreator(props){

    const [visible, setVisible] = useState(false);
    const [numOfdays, setNumofDays] = useState(0);
   
    const [unitObject, setUnitObject] = useState({
    unitName: "",
    unitGrade: 0,
    unitNumber: 0,
    unitDescrip: "",
    unitTeksId: 0,})

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
      
        const creatunit = createUnit(unitObject.unitNumber,unitObject.unitName,unitObject.unitTeksId,unitObject.unitDescrip,unitObject.unitGrade)
        const unitReponse = await creatunit
        const getUnitreponse = getUnit(unitReponse.data.id)
        const unit = await getUnitreponse
        const newArr = [...props.datasource]
        learningStandObjs.map(each=>{
            creatLeanrAndDays(each,unit,newArr)
          
        })
        
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

    return(
        <div>
            <Button style={addButtonStyle} onClick={showModal}  icon={<PlusOutlined/>}>
                </Button>
            <Modal
               title="hello"
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
            <Form.Item label="Unit Name">
                <Input onChange={(e)=>{ const {value} = e.target; setUnitObject((unitObject) => ({
                ...unitObject,
                unitName: value
                }));}}/>
            </Form.Item >
            <Form.Item label="Grade"
            onChange={(e)=>{ const {value} = e.target; setUnitObject((unitObject) => ({
                ...unitObject,
                unitGrade: parseInt(value,10)
             }));}}>
                <Input/>
            </Form.Item>
            <Form.Item label="Number"
            onChange={(e)=>{ const {value} = e.target; setUnitObject((unitObject) => ({
                ...unitObject,
                unitNumber: parseInt(value,10)
             }));}}>
                <Input />
            </Form.Item>
            <Form.Item label="Description"
            onChange={(e)=>{ const {value} = e.target; setUnitObject((unitObject) => ({
                ...unitObject,
                unitDescrip: value
             }));}}>
                <Input />
            </Form.Item>
            <Form.Item label="Teks ID"
            onChange={(e)=>{ const {value} = e.target; setUnitObject((unitObject) => ({
                ...unitObject,
                unitTeksId: value
             }));}}>
                <Input />
            </Form.Item>
            <div>Learning Standards</div>
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
        <Form.Item size="small" label="Number of Days"
        onChange={(e)=>{ const {value} = e.target; setNumofDays(value);}}>
                <Input/>
        </Form.Item>

        <Form.Item>
            <Button type="primary" htmlType="submit" onClick={onclickhandler}>
            Create a Unit
            </Button>
        </Form.Item>

        </Form>
    
        </Modal>

            
            </div>
    )
}