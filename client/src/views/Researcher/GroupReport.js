import NavBar from '../../components/NavBar/NavBar';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GroupReport.less';

export default function GroupReport(props) {
  const navigate = useNavigate();
  return (
    <div className='container nav-padding'>
      <NavBar />
      {/* <h1>Group Report</h1> */}
      <div className='menu-bar'>
        <div id='daily-report-header'>Group Level Report</div>

        {/* Do we need a menu button to go back to report landing page?*/}
        <button
          id={'group-level-return'}
          className={`btn-${'primary'} btn-${'sm'}`}
          type='button'
          onClick={() => navigate('/report')}
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
