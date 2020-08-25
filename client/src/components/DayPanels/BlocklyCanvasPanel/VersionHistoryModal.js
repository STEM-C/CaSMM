import {Modal, Button} from 'antd';
import React, {useState} from "react";

export default function VersionHistoryModal(props) {
    const [visible, setVisible] = useState(false);
    const {saves, defaultTemplate} = props;

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
            <Button onClick={showModal}>Version History</Button>
            <Modal
                title={'Your Version History'}
                visible={visible}
                onCancel={handleCancel}
                width='50vw'
                footer={[
                    <Button key="ok" type="primary" onClick={handleOk}>
                        OK
                    </Button>,
                ]}
            >
                <ul>
                    {saves.current ? <li value={saves.current.id} key={saves.current.id}>
                        Active Save
                    </li> : null}
                    {saves.past ? saves.past.map(save =>
                        <li value={save.id} key={save.id}>
                            {`${save.student.name}'s save 
                            from ${save.updated_at.slice(5, 7)}/${save.updated_at.slice(8, 10)}`}
                        </li>) : null}
                    <li>
                        Default Template
                    </li>
                </ul>
            </Modal>
        </div>
    );
}