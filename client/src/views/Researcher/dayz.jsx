import { message } from 'antd';
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import { getArduinoXML } from '../../components/DayPanels/Utils/helpers';
import { getSession, getDay, updateDayArduino } from '../../Utils/requests';
import './dayz.less';
//import { findSuperAdmins } from '../../../../server/extensions/users-permissions/controllers/Auth';


const useFormInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    setValue(e.target.value);
  };
  return {
    value,
    onChange: handleChange,
  };
};

export default function CodeDayz() {
  const rID = useFormInput('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const workspaceRef = useRef(null);

  const handleLogin = () => {
    setLoading(true);
    //console.log(rID)
    getDay(parseInt(rID.value))
      .then((response) => {
        //console.log(response)
        if (workspaceRef.current) {
            workspaceRef.current.dispose()
        };

        workspaceRef.current = window.Blockly.inject('blockly-box', {
            toolbox: document.getElementById('toolbox'),
            readOnly: true,
          });


        if (!response.data) {

          message.error('No workspace associated with ID');
          setLoading(false);  
          workspaceRef.current.dispose();  
        }
        else {
            setLoading(false);
            //console.log(response.data.template);

            //console.log(getArduinoXML(response.data.template, workspaceRef.current));
            updateDayArduino(parseInt(rID.value), getArduinoXML(response.data.template, workspaceRef.current), getArduinoXML(response.data.activity_template, workspaceRef.current))
                .catch(error => {
                    console.log(error)
                });
            workspaceRef.current.dispose();
        }


      })
      .catch((error) => {
        message.error('Please enter a valid workspace ID');
        console.log(error);
        setLoading(false);
        if (workspaceRef.current) {
            workspaceRef.current.dispose()
        };

      });
  };

  return (
    <div className='container nav-padding'>
      <NavBar />
      <div id='content-wrapper'>
        <form
          id='box'
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleLogin();
          }}
        >
          <div id='box-title'>Update Day Record</div>
          <input
            type='email'
            {...rID}
            placeholder='Day ID'
            autoComplete='username'
          />
          <input
            type='button'
            value={loading ? 'Loading...' : 'Update Day'}
            onClick={handleLogin}
            disabled={loading}
          />
          


        </form>
      </div>
      <div id='blockly-box'></div>
    </div>
  );
}
