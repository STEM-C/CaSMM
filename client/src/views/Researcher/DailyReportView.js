import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import { getSession } from '../../Utils/requests';
import './DailyReport.less';

const DailyReportView = () => {
  const { id } = useParams();
  const [session, setSession] = useState({});
  useEffect(function() {
    const getData = async () => {
      const session = await getSession(id);
      setSession(session.data);
    }
    getData();
  }, [])

  const calculateEndTime = () => {
    if(session.saves?.length) {
      if (session.saves[session.saves.length - 1].created_at) {
        return session.saves[session.saves.length - 1].created_at
      }
      return 'Unknown, no saves'
    }
  }
  const showReplayButtion = () => {
    if(session.saves?.length) {
      const latestSave = session.saves[session.saves.length - 1];
      return <Link to={`/replay/${latestSave.id}`}>View Code Replay</Link>
    }
  }
  return (
    <div className="container nav-padding">
      <NavBar />
      <div className="menu-bar">
        <div id="daily-report-header">Day Level - Student Report</div>
        <Link to={"/report"}>
          <button
            id={"day-level-return"}
            className={`btn-${"primary"} btn-${"sm"}`}
            type="button"
          >
            Return to Reports
          </button>
        </Link>
      </div>

      <main id="content-wrapper">
        <section id="container-section">
          <section>
            <h1>Started: {session.created_at}</h1>
            <h2>Ended: {calculateEndTime()}</h2>
            <h1>Mouse Clicks</h1>
            <h1>Deleted Blocks</h1>
          </section>
          <section>
            <h2>45 Mins</h2>
            <h2>140 Clicks</h2>
            <h2>Tested {session.submissions?.length} times</h2>
          </section>
          {showReplayButtion()}
        </section>
      </main>
    </div>
  )
};

export default DailyReportView;