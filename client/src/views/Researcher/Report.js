import NavBar from '../../components/NavBar/NavBar';
import RouteButton from '../../components/RouteButton/RouteButton'
import React, { useState } from 'react';
//import './Report.less';

export default function Report(props) {

  return (
    <div className='container nav-padding'>
      <NavBar />
      {/*Reports is not centered*/}
      <h1>Reports</h1>
      <RouteButton id="route-button" link="/daily-report" size={"sm"} variant="primary">Day Level</RouteButton>
      <RouteButton id="route-button" link="/group-report" size={"sm"} variant="primary">Group Level</RouteButton>
    </div>
  );
}
