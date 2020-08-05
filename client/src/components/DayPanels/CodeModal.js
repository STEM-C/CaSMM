import {Modal, Button, Typography} from 'antd';
import React, {useState} from "react";
import {getArduino, getXml} from "./helpers";

export default function CodeModal(props) {
    const [visible, setVisible] = useState(false);
    const {title, workspaceRef, setHover, hover} = props;
    const {Text} = Typography;

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
        <div id='code-modal'>
            <i onClick={showModal} className={title === 'XML' ? "fa fa-code hvr-info" : "fa fa-cogs hvr-info"}
               onMouseEnter={() => setHover(true)}
               onMouseLeave={() => setHover(false)}/>
            {hover &&
            (title === 'XML' ?
                <div className="popup XML">Shows XML</div> :
                <div className="popup Arduino">Shows Arduino Code</div>)}
            <Modal
                title={title}
                visible={visible}
                onCancel={handleCancel}
                width='50vw'
                footer={[
                    <Button key="ok" type="primary" onClick={handleOk}>
                        OK
                    </Button>,
                ]}
            >
                {workspaceRef ?
                    <Text copyable style={{whiteSpace: "pre-wrap"}}>
                        {title === 'XML' ? getXml(workspaceRef, false) : getArduino(workspaceRef, false)}
                    </Text>
                    : null}
            </Modal>
        </div>
    );
}