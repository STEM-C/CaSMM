import {Modal, Button} from 'antd';
import React, {useState} from "react";
import './Home.less'

export default function DisplayDiagramModal(props) {
    const [visible, setVisible] = useState(false);
    const {image} = props;
    

    const showModal = () => {
        setVisible(true)
    };

    const handleCancel = () => {
        setVisible(false)
    };

    const handleOk = () => {
        setVisible(false)
    };
    const links = image.split('\n');
    let items = [];
    for (let i = 0; i< links.length; i++){
       items.push(<img src={links[i]} display="block" position="relative" alt="" width="auto" height="300"/>);
    }

    return (
        <div id='display-diagram-modal'>
            <button id='display-code-btn'
             onClick={showModal}>Click to display diagrams</button>
            <Modal
                title={'Diagrams'}
                visible={visible}
                onCancel={handleCancel}
                width='50vw'
                footer={[
                    <Button key="ok" type="primary" onClick={handleOk}>
                        OK
                    </Button>,
                ]}
            >
                <div id="code-display-text">
                {items} 
                </div>
            </Modal>
        </div>
    );
}