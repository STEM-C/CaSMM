import { message } from 'antd';
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import { getArduinoXML } from '../../components/DayPanels/Utils/helpers';
import { getSession } from '../../Utils/requests';
import './viz.less';
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

export default function CodeViz() {
  const rID = useFormInput('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const workspaceRef = useRef(null);
  const superEmails = [];

  const handleLogin = () => {
    setLoading(true);
    //console.log(rID)
    getSession(parseInt(rID.value))
      .then((response) => {
        //console.log(response)
        if (workspaceRef.current) {
            workspaceRef.current.dispose()
        }
        workspaceRef.current = window.Blockly.inject('blockly-box', {
            toolbox: document.getElementById('toolbox'),
            readOnly: true,
          });
        
        

        if (response.data === '') {
          workspaceRef.current.dispose();  
          message.error('No workspace associated with ID');
          setLoading(false);  
        }
        else {
            setLoading(false);
            console.log(getArduinoXML(response.data.saves[response.data.saves.length - 1].workspace, workspaceRef.current));
        }


      })
      .catch((error) => {
        message.error('Please enter a valid workspace ID');
        setLoading(false);
        workspaceRef.current.dispose();

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
          <div id='box-title'>Find Workspace</div>
          <input
            type='email'
            {...rID}
            placeholder='ID'
            autoComplete='username'
          />
          <input
            type='button'
            value={loading ? 'Loading...' : 'Find Workspace'}
            onClick={handleLogin}
            disabled={loading}
          />
          


        </form>
      </div>
      <div id='blockly-box'></div>
    </div>
  );
}
