import {Modal, Button} from 'antd';
import React, {useState} from "react";
import '../DayPanels.less'

export default function VersionHistoryModal(props) {
    const [visible, setVisible] = useState(false);
    const {saves, loadSave} = props;

    const showModal = () => {
        setVisible(true)
    };

    const handleCancel = () => {
        setVisible(false)
    };

    const handleOk = () => {
        setVisible(false)
    };

    const handleSelected = selectedId => {
        loadSave(selectedId);
        setVisible(false)
    };

    return (
        <div id='history-modal'>
            <Button onClick={showModal}>Version History</Button>
            <Modal
                title={'Your Version History'}
                visible={visible}
                onCancel={handleCancel}
                width='60vw'
                footer={[
                    <Button key="ok" type="primary" onClick={handleOk}>
                        OK
                    </Button>,
                ]}
            >
                <ul>
                    {saves.current ? <li value={saves.current.id} key={saves.current.id}>
                        <div id='history-item'>
                            <div id='item-content'>
                                Active save
                            </div>
                            <div id='item-content'>
                                <Button onClick={() => handleSelected(saves.current.id)}>
                                    Current
                                </Button>
                            </div>
                        </div>
                    </li> : null}
                    {saves.past ? saves.past.map(save =>
                        <li value={save.id} key={save.id}>
                            <div id='history-item'>
                                <div id='item-content'>
                                    {save.student.name}'s save
                                    from {save.updated_at.slice(5, 7)}/{save.updated_at.slice(8, 10)}
                                </div>
                                <div id='item-content'>
                                    <Button onClick={() => handleSelected(save.id)}>
                                        Restore this save
                                    </Button>
                                </div>
                            </div>
                        </li>) : null}
                    <li key={-2}>
                        <div id='history-item'>
                            <div id='item-content'>
                                Default template
                            </div>
                            <div id='item-content'>
                                <Button onClick={() => handleSelected(-1)}>
                                    Start over
                                </Button>
                            </div>
                        </div>
                    </li>
                </ul>
            </Modal>
        </div>
    );
}