import NavBar from '../../components/NavBar/NavBar';
import ReportDropdown from '../../components/DropdownMenu/ReportDropdown';
import React, {useEffect} from 'react';
import './DailyReport.less';
import {getStudent} from "../../Utils/requests";
import { Link } from 'react-router-dom';

export default function DailyReport(props) {

  // TODO:
  // useEffect to do call from requests.js in utils to backend to get a single student by id
  // join to classroom to get the mentor name, and grade
  // join to session to get partners
  // session can be related to a submission
  useEffect(function() {
    getStudent(2)
      .then(data => console.log(data))
  }, [])
  return (
    <div className="container nav-padding">
      <NavBar />
      <div className="menu-bar">
        <div id="daily-report-header">Day Level Report</div>
        
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

      <main id="content-wrapper">
        <div className="cards">
          <section id="container-section">
            <section>
              <ReportDropdown/>
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
