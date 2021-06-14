import React,{useState} from 'react'
import {Form, Input, Button, Modal} from 'antd'
import {PlusOutlined} from '@ant-design/icons'
import {createUnit} from '../../../Utils/requests'
import './UnitCreator.less'

export default function UnitCreator(props){

    const [visible, setVisible] = useState(false);
    const unitDefaultState = {
        unitName: "",
        unitGrade: "",
        unitNumber: "",
        unitDescrip: "",
        unitTeksId: "",}

    const [unitObject, setUnitObject] = useState(unitDefaultState)


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

     const onClickHandler= async()=>{
        //console.log(getLearningStandard(1))
        console.log(unitObject)
      
        await createUnit(unitObject.unitNumber,unitObject.unitName,unitObject.unitTeksId,unitObject.unitDescrip,unitObject.unitGrade)
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
    
    const setGradeOptions = () => {
        let options = [];
        for(let i = 0; i < props.gradeMenu.length; i++){
            options.push(<option key={i+1} value={props.gradeMenu[i].id}>{props.gradeMenu[i].name}</option>)
        }
        return options
    };
    
    return(
        <div>
            <Button style={addButtonStyle} onClick={showModal}  icon={<PlusOutlined/>}>
                Add Unit
                </Button>
            <Modal
               title="Create Unit"
               visible={visible}
               onCancel={handleCancel}
               onOk={onClickHandler}
            >
            <Form id="add-units"
            labelCol={{
                span: 4
              }}
              wrapperCol={{
                span: 14
              }}
              layout="horizontal"
              size="default">
            <Form.Item id="form-label" label="Unit Name">
                <Input onChange={unitNameOnChange} value ={unitObject.unitName}/>
            </Form.Item >
            <Form.Item id="form-label" label="Grade">
                <select id="grade" name='grade' defaultValue={unitObject.unitGrade} onChange={unitGradeOnChange}>
                    <option key={0} value={unitObject.unitGrade} disabled id='disabled-option'>Grade</option>
                    {setGradeOptions().map(option => option)}
                </select>
                {/* <Input value = {unitObject.unitGrade} /> */}
            </Form.Item>
            <Form.Item id="form-label" label="Number">
                <Input onChange={unitNumberOnChange} value = {unitObject.unitNumber}/>
            </Form.Item>
            <Form.Item id="form-label" label="Description">
                <Input onChange={unitDescripOnChange} value = {unitObject.unitDescrip}/>
            </Form.Item>
            <Form.Item id="form-label" label="TekS">
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