import {Modal, Button} from 'antd';
import React, {useState} from "react";
import { Form } from 'react-router-dom';
import './Home.less'
import { updateClassroom } from '../../../../Utils/requests';

export default function DisplayFormModal(props) {
    const [visible, setVisible] = useState(false);
    const {classroom} = props;
    const [form, setForm] = useState('')

    const showModal = () => {
        setForm('')
        setVisible(true)
    };

    const handleCancel = () => {
        setVisible(false)
    };

    const handleTyping = (event) => {

        setForm(event.target.value)
    }

    const handleOk = () => {
        //console.log(form)
        classroom.form = form
        updateClassroom(classroom.id, classroom.form)
        setVisible(false)
    };

    return (
        <div id='display-form-modal'>
            <button id='display-form-btn' onClick={showModal}>Click to change form code</button>
            <Modal
                title={'Edit Form Code'}
                visible={visible}
                onCancel={handleCancel}
                width='50vw'
                footer={[
                    <Button key="ok" type="primary" onClick={handleOk}>
                        OK
                    </Button>,
                ]}
            >
            <input type='text' id='textbox' placeholder='Enter Google Form Link' onChange={handleTyping} defaultValue={''}></input>
            </Modal>
        </div>
    );
}
