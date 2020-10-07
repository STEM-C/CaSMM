import React,{useState} from 'react'
import Navbar from '../../../components/NavBar/NavBar'
import {Form, Input, Button, Card, Modal} from 'antd'
import {PlusOutlined} from '@ant-design/icons'


import './UnitCreator.less'

export default function UnitCreator(props){

    const [visible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true)
    };

    const handleCancel = () => {
        setVisible(false)
    };

    const handleOk = () => {
        setVisible(false)
    };

    const addButtonStyle={
        background: "#F4F4F5",
        borderRadius: "20px",
        border: "2px solid #5BABDE",
        left: '500px',
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
                <Input/>
            </Form.Item>
            <div>Learning Standards</div>
            <Form.List name="names">
        {(fields, { add, remove }) => {
            return(
                <div>
                    {fields.map((field,index) =>(
                        <div>
                            <Form layout="inline" size="small">
                            <Form.Item layout="inline" size="small" label="Name"><Input/></Form.Item>
                            <Form.Item layout="inline" size="small" label="Description"><Input/></Form.Item>
                        </Form>
                        </div>
                    ))
                    }
            <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
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
        <Form.Item size="small" label="Number of Days">
                <Input/>
        </Form.Item>

        <Form.Item>
            <Button type="primary" htmlType="submit">
            Create a Unit
            </Button>
        </Form.Item>

        </Form>
    
        </Modal>

            
            </div>
    )
}