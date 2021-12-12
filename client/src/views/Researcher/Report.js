import NavBar from '../../components/NavBar/NavBar';
import RouteButton from '../../components/RouteButton/RouteButton';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Report.less';

export default function Report(props) {
  return (
    <div className='container nav-padding'>
      <NavBar />
      <div id='main-header'>Welcome Researcher!</div>

      <div>
        <div class='parent'>
          <div class='child inline-block-child'>Home</div>
          <div class='child inline-block-child'>Reports</div>
        </div>
        <Link to={'/daily-report'}>
          <button
            id={'route-button'}
            className={`btn-${'primary'} btn-${'sm'}`}
            type='button'
          >
            Day Level Report
          </button>
        </Link>
        <Link to={'/group-report'}>
          <button
            id={'route-button'}
            className={`btn-${'primary'} btn-${'sm'}`}
            type='button'
          >
            Group Level Report
          </button>
        </Link>
      </div>
    </div>
  );
}
