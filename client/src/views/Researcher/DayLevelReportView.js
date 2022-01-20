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
  const [clicks, setClicks] = useState(0)
  
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
      
      // const fetchedClicks = session.data.saves[0].replay[0].clicks;
      // setClicks(fetchedClicks);

    }
    getData();
  }, [])

  const timeConverter = (timestamp) => {
    var dateVal = new Date(timestamp).toLocaleString();
    return dateVal;
  };

  const calculateEndTime = () => {
    if(session.saves?.length) {
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
          <section id='student-report-section'>
            <p><strong>Student Name: </strong>{studentName}</p>
            {/* <h2>Partner Name: {studentPartner}</h2> */}
            <p><strong>Class Name: </strong>{className}</p>
            <br />
            <p><strong>Started: </strong>{timeConverter(session.created_at)}</p>
            <p><strong>Ended: </strong>{timeConverter(calculateEndTime())}</p>
            <p><strong>Mouse Clicks: </strong>{clicks}</p>
            <p><strong>Deleted Blocks: </strong>N/A</p>
            <p><strong>Times Tested: </strong>{session.submissions?.length} times</p>
          </section>
        </section>
        <br />
          {showReplayButton()}
      </main>
    </div>
  )
};

export default DayLevelReportView;