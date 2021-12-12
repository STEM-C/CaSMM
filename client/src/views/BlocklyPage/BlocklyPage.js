import React, { useEffect, useState } from 'react';
import BlocklyCanvasPanel from '../../components/DayPanels/BlocklyCanvasPanel/BlocklyCanvasPanel';
import NavBar from '../../components/NavBar/NavBar';
import {
  getDayToolbox,
  getDayToolboxAll,
  getCCWorkspaceToolbox,
} from '../../Utils/requests';
import { message } from 'antd';
import { useGlobalState } from '../../Utils/userState';

export default function BlocklyPage({ history, isSandbox }) {
  const [day, setDay] = useState({});
  const [value] = useGlobalState('currUser');

  const userRole = value.role;

  useEffect(() => {
    const setup = async () => {
      // if we are in sandbox mode show all toolbox
      const sanboxDay = JSON.parse(localStorage.getItem('sandbox-day'));
      if (isSandbox) {
        const AllToolboxRes = await getDayToolboxAll();
        if (!sanboxDay?.id) {
          if (AllToolboxRes.data) {
            let loadedDay = { toolbox: AllToolboxRes.data.toolbox };
            localStorage.setItem('sandbox-day', JSON.stringify(loadedDay));
            setDay(loadedDay);
          } else {
            message.error(AllToolboxRes.err);
          }
        } else {
          const res = await getCCWorkspaceToolbox(sanboxDay.id);
          if (res.data) {
            let loadedDay = { ...sanboxDay, selectedToolbox: res.data.toolbox };
            loadedDay = { ...loadedDay, toolbox: AllToolboxRes.data.toolbox };

            localStorage.setItem('sandbox-day', JSON.stringify(loadedDay));
            setDay(loadedDay);
          } else {
            message.error(res.err);
          }
        }
      }
      // else show toolbox based on the day we are viewing
      else {
        const localDay = JSON.parse(localStorage.getItem('my-day'));

        if (localDay) {
          if (localDay.toolbox) {
            setDay(localDay);
          } else {
            const res = await getDayToolbox(localDay.id);
            if (res.data) {
              let loadedDay = { ...localDay, toolbox: res.data.toolbox };

              localStorage.setItem('my-day', JSON.stringify(loadedDay));
              setDay(loadedDay);
            } else {
              message.error(res.err);
            }
          }
        } else {
          history.goBack();
        }
      }
    };

    setup();
  }, [history, isSandbox]);

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
