import React, { useEffect, useState } from 'react';
import { getDayToolbox } from '../../Utils/requests.js';
import BlocklyCanvasPanel from '../../components/DayPanels/BlocklyCanvasPanel/BlocklyCanvasPanel';
import { message } from 'antd';
import NavBar from '../../components/NavBar/NavBar';
import { useNavigate } from 'react-router-dom';

export default function Workspace({ handleLogout }) {
  const [day, setDay] = useState({});

  useEffect(() => {
    const localDay = JSON.parse(localStorage.getItem('my-day'));
    const navigate = useNavigate();

    if (localDay) {
      if (localDay.toolbox) {
        setDay(localDay);
      } else {
        getDayToolbox(localDay.id).then((res) => {
          if (res.data) {
            let loadedDay = { ...localDay, toolbox: res.data.toolbox };

            localStorage.setItem('my-day', JSON.stringify(loadedDay));
            setDay(loadedDay);
          } else {
            message.error(res.err);
          }
        });
      }
    } else {
      navigate(-1);
    }
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className='container flex flex-row nav-padding'>
      <NavBar isStudent={true} />
      <BlocklyCanvasPanel
        day={day}
        lessonName={`${day.learning_standard_name}, Day ${day.number}`}
        handleGoBack={handleGoBack}
        handleLogout={handleLogout}
        isStudent={true}
      />
    </div>
  );
}
