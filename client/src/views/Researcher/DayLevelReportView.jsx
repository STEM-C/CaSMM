import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import { getSession, updateSessionArduino } from '../../Utils/requests';
import './DayLevelReportView.less';
import { confirmRedirect } from '../../App';
import { getArduinoXML } from '../../components/DayPanels/Utils/helpers';

const DayLevelReportView = () => {
  const { id } = useParams();
  const [session, setSession] = useState({});
  const [studentName, setStudentsName] = useState([]);
  const [studentPartner, setStudentsPartner] = useState([]);
  const [className, setClassName] = useState([]);
  const [clicks, setClicks] = useState(0);
  const navigate = useNavigate();
  const workspaceRef = useRef(null);
  confirmRedirect();
  useEffect(function () {
    const getData = async () => {
      const session = await getSession(id);
      workspaceRef.current = window.Blockly.inject('root', {
        toolbox: document.getElementById('toolbox'),
        readOnly: true,
      });
      //console.log(getArduinoXML(session.data.saves[session.data.saves.length - 1].workspace, workspaceRef.current))
      updateSessionArduino(session.data.id, getArduinoXML(session.data.saves[session.data.saves.length - 1].workspace, workspaceRef.current))
      .catch(error => {
        console.log(error)
      });
      workspaceRef.current.dispose();
      setSession(session.data);

      const fetchedStudents = session.data.students[0].name;
      setStudentsName(fetchedStudents);

      const fetchedPartner = session.data.students
        .slice(1)
        .map((student) => student.name);
      setStudentsPartner(fetchedPartner);

      const fetchedClassroomNames = session.data.classroom.name;
      setClassName(fetchedClassroomNames);

      const l = session.data.saves[0]?.replay.length;
      const fetchedClicks = session.data.saves[0]?.replay[l - 1]?.clicks;
      setClicks(fetchedClicks);
    };
    getData();


  }, []);

  const timeConverter = (timestamp) => {
    var dateVal = new Date(timestamp).toLocaleString();
    return dateVal;
  };

  const calculateEndTime = () => {
    if (session.saves?.length) {
      if (session.saves[session.saves.length - 1].created_at) {
        return session.saves[session.saves.length - 1].created_at;
      }
      return 'Unknown, no saves';
    }
  };

  const showReplayButton = () => {
    if (session.saves?.length) {
      const latestSave = session.saves[session.saves.length - 1];
      return (
        <Link id='replay-btn' className='btn' to={`/replay/${latestSave.id}`}>
          View Code Replay
        </Link>
      );
    }
  };
  return (
    <div className='container nav-padding'>
      <NavBar />
      <div className='menu-bar'>
        <div id='day-level-report-header'>Day Level - Student Report</div>
        <button
          id={'day-level-return'}
          className={`btn-${'primary'} btn-${'sm'}`}
          type='button'
          onClick={() => navigate(-1)}
        >
          Return to Day Level
        </button>
      </div>

      <main id='content-wrapper'>
        <section id='container-section'>
          <section id='student-report-section'>
            <p>
              <strong>Student Name: </strong>
              {studentName}
            </p>
            <p>
              <strong>Partner Name: </strong>
              {studentPartner.length > 0 ? studentPartner.join(', ') : ''}
            </p>
            <p>
              <strong>Class Name: </strong>
              {className}
            </p>
            <br />
            <p>
              <strong>Started: </strong>
              {timeConverter(session.created_at)}
            </p>
            <p>
              <strong>Ended: </strong>
              {timeConverter(calculateEndTime())}
            </p>
            <p>
              <strong>Mouse Clicks: </strong>
              {clicks}
            </p>
            <p>
              <strong>Times Tested: </strong>
              {session.submissions?.length} times
            </p>
          </section>
        </section>
        <br />
        {showReplayButton()}
      </main>
    </div>
  );
};

export default DayLevelReportView;
