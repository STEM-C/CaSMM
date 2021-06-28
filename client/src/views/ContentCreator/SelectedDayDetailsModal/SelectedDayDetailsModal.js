import React,{useState} from 'react'
import {Form, Input, Button, Modal} from 'antd'
import './SelectedDayDetailsModal.less'

export default function SelectedDayDetailsModal(props) {
    const [visible, setVisible] = useState(false);
    
    const linkBtn = props.linkBtn;

    const showModal = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false)
    };

    return (
        <div>
            <Button id={linkBtn ? 'link-btn' : null} onClick={showModal}>Selected Day Btn</Button>
            <Modal
                title="Add Selected Day Lesson Details"
                visible={visible}
                footer={[
                    // <Button type="primary" onClick={handleBackSelectDay}>Back</Button>,
                    <Button onClick={handleCancel}>Cancel</Button>,
                    <Button type="primary">Next</Button>,
                ]}>
            <Form.Item id="form-label" label="Lesson Name">
                <Input></Input>
            </Form.Item>
            <Form.Item id="form-label" label="Description">
                <Input></Input>
            </Form.Item>
            <Form.Item id="form-label" label="TekS">
                <Input></Input>
            </Form.Item>
            <h3>Lesson Learning Components</h3>
            <Form.Item id="form-label" label="Science Component">
            <Input></Input>
                </Form.Item>
            <Form.Item id="form-label" label="Maker Component">
                <Input></Input>
            </Form.Item>
            <Form.Item id="form-label" label="Computer Science Component">
                <Input></Input>
            </Form.Item>
        </Modal>
        </div>
    )
}