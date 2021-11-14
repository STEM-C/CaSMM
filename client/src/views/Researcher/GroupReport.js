import NavBar from '../../components/NavBar/NavBar';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './GroupReport.less';

export default function GroupReport(props) {

  return (
    <div className="container nav-padding">
      <NavBar />
      {/* <h1>Group Report</h1> */}
      <div className="menu-bar">
        <div id="daily-report-header">Group Level Report</div>
        
        {/* Do we need a menu button to go back to report landing page?*/}
        <Link to={"/report"}>
          <button
            id={"menu-button"}
            className={`btn-${"primary"} btn-${"sm"}`}
            type="button"
          >
            Menu
          </button>
        </Link>
      </div>
    </div>
  );
}
