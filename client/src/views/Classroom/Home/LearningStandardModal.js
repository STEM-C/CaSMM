import {Modal, Button} from 'antd';
import React, {useState} from "react";
import ActivityCatalogue from "../ActivityCatalogue/ActivityCatalogue";

export default function LearningStandardModal(props) {
    const [visible, setVisible] = useState(false);
    const {history, selectedActivity, setSelectedActivity} = props;

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
        <div id='learning-standard-modal'>
            <button id="change-lesson-btn" onClick={showModal}>Change active learning standard</button>
            <Modal
                title={'Learning Standards:'}
                visible={visible}
                onCancel={handleCancel}
                width='90vw'
                footer={[
                    <Button key="ok" type="primary" onClick={handleOk}>
                        OK
                    </Button>,
                ]}
            >
                <ActivityCatalogue history={history} selectedActivity={selectedActivity}
                                   setSelectedActivity={setSelectedActivity}/>
            </Modal>
        </div>
    );
}