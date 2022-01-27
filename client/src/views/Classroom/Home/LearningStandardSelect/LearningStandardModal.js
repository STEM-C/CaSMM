import { Modal, Button, message } from 'antd';
import React, { useEffect, useState } from 'react';
import LearningStandardSelect from './LearningStandardSelect';
import {
  getLearningStandard,
  setSelection,
  getLearningStandardDays,
} from '../../../../Utils/requests';
import { useNavigate } from 'react-router-dom';

export default function LearningStandardModal(props) {
  const [visible, setVisible] = useState(false);
  const [activePanel, setActivePanel] = useState('panel-1');
  const [selectedDays, setSelectedDays] = useState([]);
  const [selected, setSelected] = useState({});
  const { setActiveLearningStandard, gradeId, classroomId, viewing, setDays } =
    props;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      console.log(viewing);
      if (viewing) {
        const res = await getLearningStandard(viewing);
        if (res.data) {
          setSelected(res.data);
          const daysRes = await getLearningStandardDays(res.data.id);
          if (daysRes) setSelectedDays(daysRes.data);
          else {
            message.error(daysRes.err);
          }
          setVisible(true);
          setActivePanel('panel-2');
        } else {
          message.error(res.err);
        }
      }
    };
    fetchData();
  }, [viewing]);

  const showModal = () => {
    setActivePanel('panel-1');
    setVisible(true);
  };

  const handleCancel = () => {
    navigate('#home');
    setVisible(false);
  };

  const handleOk = async () => {
    history.push('#home');
    const res = await setSelection(classroomId, selected.id);
    if (res.err) {
      message.error(res.err);
    } else {
      setActiveLearningStandard(selected);
      setDays(selectedDays);
      message.success('Successfully updated active learning standard.');
      setVisible(false);
    }
  };

  const handleReview = () => {
    history.push(`#home#${selected.id}`);
    setActivePanel('panel-2');
  };

  return (
    <div id='learning-standard-modal'>
      <button id='change-lesson-btn' onClick={showModal}>
        <p id='test'>Change</p>
      </button>
      <Modal
        title={
          activePanel === 'panel-1'
            ? 'Select a Learning Standard:'
            : selected.name
        }
        visible={visible}
        onCancel={handleCancel}
        width='60vw'
        footer={[
          <Button
            key='ok'
            type='primary'
            disabled={selected.id === undefined}
            onClick={activePanel === 'panel-1' ? handleReview : handleOk}
          >
            {activePanel === 'panel-1'
              ? 'Review'
              : 'Set as Active Learning Standard'}
          </Button>,
        ]}
      >
        <LearningStandardSelect
          history={history}
          activePanel={activePanel}
          setActivePanel={setActivePanel}
          selected={selected}
          setSelected={setSelected}
          gradeId={gradeId}
          days={selectedDays}
          setDays={setSelectedDays}
        />
      </Modal>
    </div>
  );
}
