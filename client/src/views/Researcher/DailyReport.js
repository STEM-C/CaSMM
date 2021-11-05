import NavBar from '../../components/NavBar/NavBar';
import Dropdown from '../../components/DropdownMenu/Dropdown';
import { DownOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import './DailyReport.less';

export default function DailyReport(props) {

  return (
    <div className='container nav-padding'>
      <NavBar />
      <h1>Daily Report</h1>
      <main id='content-wrapper'>
        <div className='cards'>
        
          <section id="container-section">
            <section>
              <Dropdown>
                
              </Dropdown>
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
          </section>
        </div>
        <section id="container-section">
            <section>
                <h1>Time Spent Programming</h1>
                <h1>Mouse Clicks</h1>
                <h1>Time it Tested Code</h1>
                <h1>Deleted Blocks</h1>
                <h1>Blocks Selected but Never used</h1>
            </section>
            <section>
                {/**TODO: pass data instead of hard coded values */}
                <h2>45 Mins</h2>
                <h2>140 Clicks</h2>
                <h2>tested 4 Times</h2>
                <h2>1 Forever Loop</h2>
                <h2>Forever Loop (1)</h2>
            </section>
        </section>
      </main>
    </div>
    
  );
}
