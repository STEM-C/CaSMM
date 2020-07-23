import {Modal, Button} from 'antd';
import React, {useState} from "react";

export default function DisplayCodeModal(props) {
    const [visible, setVisible] = useState(false);
    const {code} = props;

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
            <button id='display-code-btn' onClick={showModal}>Click to display join code</button>
            <Modal
                title={'Join Code'}
                visible={visible}
                onCancel={handleCancel}
                footer={[
                    <Button key="ok" type="primary" onClick={handleOk}>
                        OK
                    </Button>,
                ]}
            >
                <div id="code-display-text">{code}</div>
            </Modal>
        </div>
    );
}