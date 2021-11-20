import NavBar from '../../components/NavBar/NavBar';
import ReportDropdown from '../../components/DropdownMenu/ReportDropdown';
import React, {useEffect} from 'react';
import './DailyReport.less';
import {getUser} from "../../Utils/AuthRequests";
import {getStudent} from "../../Utils/requests";
import { Link } from 'react-router-dom';

export default function DailyReport(props) {

  /**
   * data:
      character: "🐕"
      classroom:
      code: "0450"
      created_at: "2020-07-24T16:31:53.641Z"
      grade: 4
      id: 1
      name: "Pedro's 5th grade Science Classroom"
      school: 1
      updated_at: "2021-08-01T18:42:08.506Z"
      [[Prototype]]: Object
      created_at: "2020-07-24T16:38:28.699Z"
      enrolled: true
      id: 2
      last_logged_in: "2021-10-10T06:36:23.481Z"
      name: "Adam T."
      sessions: Array(8)
      0: {id: 1700, classroom: 1, created_at: '2021-08-21T04:12:57.849Z', updated_at: '2021-08-21T04:12:57.874Z'}
      1: {id: 1701, classroom: 1, created_at: '2021-08-21T07:11:18.632Z', updated_at: '2021-08-21T07:11:18.655Z'}
      2: {id: 1702, classroom: 1, created_at: '2021-08-21T07:42:33.720Z', updated_at: '2021-08-21T07:42:33.772Z'}
      3: {id: 1703, classroom: 1, created_at: '2021-08-21T07:42:46.273Z', updated_at: '2021-08-21T07:42:46.297Z'}
      4: {id: 1735, classroom: 1, created_at: '2021-08-21T21:16:41.425Z', updated_at: '2021-08-21T21:16:41.448Z'}
      5: {id: 1736, classroom: 1, created_at: '2021-10-10T06:35:28.343Z', updated_at: '2021-10-10T06:35:28.356Z'}
      6: {id: 1737, classroom: 1, created_at: '2021-10-10T06:35:52.742Z', updated_at: '2021-10-10T06:35:52.749Z'}
      7: {id: 1738, classroom: 1, created_at: '2021-10-10T06:36:23.464Z', updated_at: '2021-10-10T06:36:23.471Z'}
      length: 8
      [[Prototype]]: Array(0)
      updated_at: "2021-10-10T06:36:23.514Z"
      [[Prototype]]: Object
   */
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
              <ReportDropdown menuName="Teacher Name" menuItems={["Teacher 1"]}/>
                <h2>Mentor Name: John Doe</h2>
                <h2>Content Creator Name: John Doe</h2>
                <h2>Student Name: Jane Doe</h2>
            </section>
            <section>
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
