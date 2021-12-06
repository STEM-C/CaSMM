import React, { useEffect, useState } from 'react';
import BlocklyCanvasPanel from '../../components/DayPanels/BlocklyCanvasPanel/BlocklyCanvasPanel';
import NavBar from '../../components/NavBar/NavBar';
import { getDayToolbox, getDayToolboxAll } from '../../Utils/requests';
import { message } from 'antd';
import { useGlobalState } from '../../Utils/userState';

export default function Day({ history, isSandbox }) {
  const [day, setDay] = useState({});
  const [value] = useGlobalState('currUser');

  const userRole = value.role;
  let isContentCreator = false;
  let isMentor = false;
  let isStudent = false;
  let isDefaultUser = false;

  switch (userRole) {
    case 'ContentCreator':
      isContentCreator = true;
      break;
    case 'Mentor':
      isMentor = true;
      break;
    case 'Student':
      isStudent = true;
      break;
    default:
      isDefaultUser = true;
      break;
  }

  useEffect(() => {
    // if we are in sandbox mode show all toolbox
    if (isSandbox) {
      getDayToolboxAll().then((res) => {
        if (res.data) {
          const loadedDay = { toolbox: res.data.toolbox };

          localStorage.setItem('sandbox-day', JSON.stringify(loadedDay));
          setDay(loadedDay);
        } else {
          message.error(res.err);
        }
      });
    }
    // else show toolbox based on the day we are viewing
    else {
      const localDay = JSON.parse(localStorage.getItem('my-day'));

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
        history.goBack();
      }
    }
  }, []);

  return (
    <div className='container nav-padding'>
      <NavBar />
      <div className='flex flex-row'>
        <BlocklyCanvasPanel
          day={day}
          isSandbox={isSandbox}
          userRole={userRole}
        />
      </div>
    </div>
  );
}
