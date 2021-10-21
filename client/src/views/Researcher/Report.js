import NavBar from '../../components/NavBar/NavBar';
import React, { useState } from 'react';
import './Report.less';

export default function Report(props) {

  return (
    <div className='container nav-padding'>
      <NavBar />
      <h1>Report</h1>
      <main id='content-wrapper'>
        <div className='cards'>
          <section>
            <h2>Mentor Name: John Doe</h2>
            <h2>Content Creator Name: John Doe</h2>
            <h2>Student Name: Jane Doe</h2>
          </section>
          <section>
            <h2>Grade: 1st grade</h2>
            <h2>Unit Name: -- </h2>
            <h2>Date of Unit: -- </h2>
            <h2>Partner's Name: John Smith</h2>
          </section>
        </div>
        <section>
          <h1>Session Details:</h1>
          <h2>Time Spent Programming</h2>
          <h2>Programming Interaction:</h2>
        <ul>
          <li> - Mouse Clicks</li>
          <li> - Deleted blocks by category</li>
          <li> - Blocks selected but not used by students</li>
        </ul>
        </section>
      </main>
    </div>
  );
}
