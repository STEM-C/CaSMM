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
    const links = new String(image);
    let items = links.split('\n');
    let entries = [];
    for (let i = 0; i< items.length; i++){
        if (items[i] == '\n'){
            continue;
        }
       entries.push(<img src={items[i]} display="block" position="relative" alt="" width="auto" height="300"/>);
    }
    let width = entries.length * 700
    return (
        <div id='display-diagram-modal'>
            <button id='display-code-btn'
             onClick={showModal}>Click to display diagrams</button>
            <Modal
                title={'Diagrams'}
                visible={visible}
                onCancel={handleCancel}
                width={width}
                footer={[
                    <Button key="ok" type="primary" onClick={handleOk}>
                        OK
                    </Button>,
                ]}
            >
                <div id="code-display-text">
                {entries} 
                </div>
            </Modal>
        </div>
    );
}