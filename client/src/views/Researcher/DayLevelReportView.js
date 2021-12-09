import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import { getSession } from '../../Utils/requests';
import './DayLevelReportView.less';

const DayLevelReportView = () => {
  const { id } = useParams();
  const [session, setSession] = useState({})
  const [studentName, setStudentsName] = useState([])
  const [studentPartner, setStudentsPartner] = useState([])
  const [className, setClassName] = useState([])
  const [clicks, setClicks] = useState([])
  
  useEffect(function() {
    const getData = async () => {
      
      const session = await getSession(id);
      setSession(session.data);
      console.log(session.data);

      const fetchedStudents = session.data.students[0].name;
      setStudentsName(fetchedStudents);

      const fetchedPartner = session.data.students.map(student => student.name);
      setStudentsPartner(fetchedPartner);

      const fetchedClassroomNames = session.data.classroom.name;
      setClassName(fetchedClassroomNames);
      
      const fetchedClicks = session.data.saves[0].replay[0].clicks;
      setClicks(fetchedClicks);

    }
    getData();
  }, [])

  const timeConverter = (timestamp) => {
    var dateVal = new Date(timestamp).toLocaleString();
    return dateVal;
  };

  const calculateEndTime = () => {
    if(session.saves) {
      if (session.saves[session.saves.length - 1].created_at) {
        return session.saves[session.saves.length - 1].created_at
      }
      return 'Unknown, no saves'
    }
  }

  const showReplayButton = () => {
    if(session.saves?.length) {
      const latestSave = session.saves[session.saves.length - 1];
      return <Link id="replay-btn" className="btn" to={`/replay/${latestSave.id}`}>View Code Replay</Link>
    }
  }
  return (
    <div className="container nav-padding">
      <NavBar />
      <div className="menu-bar">
        <div id="day-level-report-header">Day Level - Student Report</div>
        <Link to={"/daylevel"}>
          <button
            id={"day-level-return"}
            className={`btn-${"primary"} btn-${"sm"}`}
            type="button"
          >
            Return to Day Level
          </button>
        </Link>
      </div>

      <main id="content-wrapper">
        <section id="container-section">
          <section>
            <h2>Student Name: {studentName}</h2>
            <h2>Partner Name: {studentPartner}</h2>
            <h2>Class Name: {className}</h2>
            <br />
            <h2>Started: {timeConverter(session.created_at)}</h2>
            <h2>Ended: {timeConverter(calculateEndTime())}</h2>
            <h2>Mouse Clicks: {clicks}</h2>
            <h2>Deleted Blocks: N/A</h2>
            <h2>Times Tested: {session.submissions?.length} times</h2>
          </section>
        </section>
        <br />
          {showReplayButton()}
      </main>
    </div>
  )
};

export default DayLevelReportView;