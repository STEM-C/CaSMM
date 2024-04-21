import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import { getStudentClassroom, getDay } from '../../Utils/requests';
import './Student.less';
import DayActivities from './DayActivitiesModal';


function Student() {
  const [learningStandard, setLearningStandard] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false)
  const [myDayLOL, setMyDayLOL] = useState("")
  const [dayTemplates, setDayTemplatesvisible] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      ///setMyDayLOL("879");
      try {
        const res = await getStudentClassroom();
        if (res.data) {
          if (res.data.learning_standard) {
            setLearningStandard(res.data.learning_standard);
          }
        } else {
          message.error(res.err);
        }
      } catch {}
    };
    fetchData();
  }, []);

  const toggleDropdown = () => {
    setIsOpen(true);
  };

  const handleSelection = (day) => {
    day.learning_standard_name = learningStandard.name;
    localStorage.setItem('my-day', JSON.stringify(day));

    navigate('/workspace');
  };
  const showDayTemplatesModal = (day) => {
    setMyDayLOL(day);
    //console.log("howdy world");
    setDayTemplatesvisible(true);
  }

  return (
    <div className='container nav-padding'>
      <NavBar />
      <div id='activity-container'>
        <div id='header'>
          <div>Select your Day</div>
        </div>
        <ul>
          {learningStandard.days ? (
            learningStandard.days
              .sort((day1, day2) => day1.number - day2.number)
              .map((day) => ( 
                <div
                  key={day.id}
                  id='list-item-wrapper'
                  onClick={() => showDayTemplatesModal(day.id)}
                >
                  <li>{`${learningStandard.name}: Day ${day.number}`}</li>
                </div>
              ))
          ) : (
            <div>
              <p>There is currently no active learning standard set.</p>
              <p>
                When your classroom manager selects one, it will appear here.
              </p>
            </div>
          )}
        </ul>
      </div>
      {dayTemplates ? (
      <DayActivities
        thisDay={myDayLOL}
        viewing={dayTemplates}
        setViewing={setDayTemplatesvisible}
        learningStandard={learningStandard}
      />
    ) : null}
    </div>
  );
}

export default Student;
