import {Modal, Button} from 'antd';
import React, {useState} from "react";
import './Home.less'

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
        <div id='display-code-modal'>
            <button id='display-code-btn' onClick={showModal}>Click to display join code</button>
            <Modal
                title={'Join Code'}
                visible={visible}
                onCancel={handleCancel}
                width='50vw'
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
