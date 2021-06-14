import React, { useState, useEffect } from 'react'
import { Form, Input, Modal } from 'antd'
import { getLearningStandard } from '../../../Utils/requests'


import './UnitEditor.less'


export default function UnitCreator(props) {
    const [unitObject, setUnitObject] = useState({
        unitName: "",
        unitGrade: 0,
        unitNumber: 0,
        unitDescrip: "",
        unitTeksId: 0,
    })

    useEffect(() => {
        getUnit()
        // eslint-disable-next-line
    }, [])
    const [visible, setVisible] = useState(false);
    const linkBtn = props.linkBtn;

    const showModal = () => {
        setVisible(true)
    };

    const handleCancel = () => {
        setVisible(false)
    };

    const getUnit = async () => {
        const learningStand = getLearningStandard(props.learningStandard)
        const returnUnit = await learningStand
        // console.log(returnUnit)
        setUnitObject({
            unitName: returnUnit.data.unit.name,
            unitNumber: returnUnit.data.unit.number,
            unitGrade: returnUnit.data.unit.grade,
            unitDescrip: returnUnit.data.unit.teks_description,
            unitTeksId: returnUnit.data.unit.teks_id
        })
    }


    return (
        <div>
            <button id={linkBtn ? 'link-btn' : null} onClick={showModal}>{unitObject.unitName}</button>
            <Modal
                title="Unit Creator"
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
                        <Input defaultValue={unitObject.unitName} onChange={(e) => {
                            const { value } = e.target;
                            setUnitObject((unitObject) => ({
                                ...unitObject,
                                unitName: value
                            }));
                        }}/>
                    </Form.Item>
                    <Form.Item label="Grade"
                               onChange={(e) => {
                                   const { value } = e.target;
                                   setUnitObject((unitObject) => ({
                                       ...unitObject,
                                       unitGrade: parseInt(value, 10)
                                   }));
                               }}>
                        <Input defaultValue={unitObject.unitGrade}/>
                    </Form.Item>
                    <Form.Item label="Number"
                        onChange={(e)=>{ 
                            const {value} = e.target; 
                            setUnitObject((unitObject) => ({
                            ...unitObject,
                            unitNumber: parseInt(value,10)
                        }));
                        }}>
                        <Input defaultValue={unitObject.unitNumber}/>
                    </Form.Item>
                    <Form.Item label="Description"
                        onChange={(e) => {
                            const { value } = e.target;
                            setUnitObject((unitObject) => ({
                                ...unitObject,
                                unitDescrip: value
                            }));
                        }}>
                        <Input defaultValue={unitObject.unitDescrip}/>
                    </Form.Item>
                    <Form.Item label="TekS"
                               onChange={(e) => {
                                   const { value } = e.target;
                                   setUnitObject((unitObject) => ({
                                       ...unitObject,
                                       unitTeksId: value
                                   }));
                               }}>
                        <Input defaultValue={unitObject.unitTeksId}/>
                    </Form.Item>
                    <Form.Item>
                        {/* <Button type="primary" htmlType="submit">
                            Save Unit
                        </Button> */}
                    </Form.Item>

                </Form>

            </Modal>


        </div>
    )
}