import {Modal, Button} from 'antd';
import React, {useState} from "react";
import './Dashboard.less'

export default function DashboardDisplayCodeModal(props) {
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
        <div id='dashboard-display-code-modal'>
            <button id='dashboard-display-code-btn' onClick={showModal}>
                <h1 id="number">{code}</h1>
                <p id="label">Join Code</p>
            </button>
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