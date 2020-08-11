import {Modal, Button} from 'antd';
import React, {useState} from "react";

export default function StudentModal(props) {
    const [visible, setVisible] = useState(false);
    const {linkBtn, student} = props;

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
        <div>
            <button id={linkBtn ? 'link-btn' : null} onClick={showModal}>View</button>
            <Modal
                title={student.name}
                visible={visible}
                onCancel={handleCancel}
                footer={[
                    <Button key="ok" type="primary" onClick={handleOk}>
                        OK
                    </Button>,
                ]}
            >
                <p>Animal: {student.character}</p>
                <p>Last logged in: {student.last_logged_in ? student.last_logged_in : "N/A"}</p>
                <p>Status: {student.enrolled.enrolled ? 'Enrolled' : 'Unenrolled'}</p>
            </Modal>
        </div>
    );
}