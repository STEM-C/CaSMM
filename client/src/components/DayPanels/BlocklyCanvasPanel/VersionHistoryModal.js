import {Modal, Button} from 'antd';
import React, {useState} from "react";
import '../DayPanels.less'

export default function VersionHistoryModal(props) {
    const [visible, setVisible] = useState(false);
    const {saves, loadSave, lastAutoSave, getFormattedDate} = props;

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
            <Button onClick={showModal}>
                <div className='flex space-between'>
                    <i id='eye-icon' className="fa fa-eye fa-lg"/>
                    <div>
                        Version History
                    </div>
                </div>
            </Button>
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
                bodyStyle={{height: '50vh', overflow: 'auto'}}
            >
                <ul>
                    {
                        // Last auto save option
                        lastAutoSave ? <li value={lastAutoSave.id} key={lastAutoSave.id}>
                            <div id='history-item'>
                                <div id='item-content'>
                                    Last auto-save from {getFormattedDate(lastAutoSave.updated_at).slice(11, 22)}
                                </div>
                                <div id='item-content'>
                                    <Button onClick={() => handleSelected(lastAutoSave.id)}>
                                        Restore this save
                                    </Button>
                                </div>
                            </div>
                        </li> : null
                    }
                    {
                        // Active save option
                        saves.current ? <li value={saves.current.id} key={saves.current.id}>
                            <div id='history-item'>
                                <div id='item-content'>
                                    Active save from {getFormattedDate(saves.current.updated_at).slice(11, 22)}
                                </div>
                                <div id='item-content'>
                                    <Button onClick={() => handleSelected(saves.current.id)}>
                                        Restore this save
                                    </Button>
                                </div>
                            </div>
                        </li> : null
                    }
                    {
                        // All past saves options
                        saves.past ? saves.past.map(save =>
                                <li value={save.id} key={save.id}>
                                    <div id='history-item'>
                                        <div id='item-content'>
                                            {save.student.name}'s save
                                            from {getFormattedDate(save.updated_at)}
                                        </div>
                                        <div id='item-content'>
                                            <Button onClick={() => handleSelected(save.id)}>
                                                Restore this save
                                            </Button>
                                        </div>
                                    </div>
                                </li>)
                            : null
                    }
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