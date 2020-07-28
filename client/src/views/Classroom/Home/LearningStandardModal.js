import {Modal, Button} from 'antd';
import React, {useEffect, useState} from "react";
import LearningStandardSelect from "../LearningStandardSelect/LearningStandardSelect";
import {getLearningStandard, setSelection} from "../../../Utils/requests";
import {getToken} from "../../../Utils/AuthRequests";

export default function LearningStandardModal(props) {
    const [visible, setVisible] = useState(false);
    const [activePanel, setActivePanel] = useState('panel-1');
    const [selected, setSelected] = useState({});
    const {history, setActiveLearningStandard, gradeId, classroomId, viewing} = props;

    useEffect(async () => {
        if(viewing){
            setVisible(true);
            const ls = await getLearningStandard(viewing, getToken());
            setSelected(ls);
            setActivePanel('panel-2')
        }
    }, []);

    const showModal = () => {
        setActivePanel('panel-1');
        setVisible(true)
    };

    const handleCancel = () => {
        history.push('#home');
        setVisible(false)
    };

    const handleOk = () => {
        history.push('#home');
        setSelection(classroomId, selected.id, getToken());
        setActiveLearningStandard(selected);
        setVisible(false)
    };

    const handleNext = () => {
        history.push(`#home#${selected.id}`);
        setActivePanel('panel-2')
    };

    return (
        <div id='learning-standard-modal'>
            <button id="change-lesson-btn" onClick={showModal}>Change active learning standard</button>
            <Modal
                title={activePanel === 'panel-1' ? 'Select a Learning Standard:' : selected.name}
                visible={visible}
                onCancel={handleCancel}
                width='60vw'
                footer={[
                    <Button key="ok" type="primary" disabled={selected.id === undefined}
                            onClick={activePanel === 'panel-1' ? handleNext : handleOk}>
                        {activePanel === 'panel-1' ? 'Next' : 'Set as Active Learning Standard'}
                    </Button>,
                ]}
            >
                <LearningStandardSelect history={history} activePanel={activePanel} setActivePanel={setActivePanel}
                                        selected={selected} setSelected={setSelected} gradeId={gradeId}/>
            </Modal>
        </div>
    );
}