import {Modal, Button} from 'antd';
import React, {useState} from "react";
import AddStudents from "./AddStudents";

export default function AddStudentsModal(props) {
    const [visible, setVisible] = useState(false);
    const {classroomId, addStudentsToTable} = props;

    const showModal = () => {
        setVisible(true)
    };

    const handleCancel = () => {
        setVisible(false)
    };

    const handleOk = () => {
        setVisible(false)
    };

    return (
        <div id='link'>
            <button id='link' onClick={showModal}>
                <i className="fa fa-user-plus"/>
            </button>
            <Modal
                title={"Add students to your classroom"}
                visible={visible}
                onCancel={handleCancel}
                width={'75vw'}
                footer={[
                    <Button key="ok" type="primary" onClick={handleOk}>
                        OK
                    </Button>,
                ]}
            >
                <AddStudents addStudentsToTable={addStudentsToTable} classroomId={classroomId}/>
            </Modal>
        </div>
    );
}