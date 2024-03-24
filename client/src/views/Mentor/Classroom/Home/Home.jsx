import React, { useEffect, useState } from 'react';
import './Home.less';
import {
  getClassroom,
  getLearningStandard,
  getLearningStandardDays,
} from '../../../../Utils/requests';
import MentorSubHeader from '../../../../components/MentorSubHeader/MentorSubHeader';
import DisplayCodeModal from './DisplayCodeModal';
import MentorDayDetailModal from './MentorDayDetailModal';
import LearningStandardModal from './LearningStandardSelect/LearningStandardModal';
import { message, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import MentorSandbox from './MentorSandboxModal';
import MentorSandboxMentor from './MentorSandboxModalMentor';

export default function Home({ classroomId, viewing }) {
  const [classroom, setClassroom] = useState({});
  const [days, setDays] = useState([]);
  const [gradeId, setGradeId] = useState(null);
  const [myDayLOL, setMyDayLOL] = useState(0);
  const [sandboxVisible, setSandboxVisible] = useState(false);
  const [sandboxVisibleMentor, setSandboxVisibleMentor] = useState(false);
  const [activeLearningStandard, setActiveLearningStandard] = useState(null);
  const [dayDetailsVisible, setDayDetailsVisible] = useState(false)
  const navigate = useNavigate();

  const SCIENCE = 1;
  const MAKING = 2;
  const COMPUTATION = 3;

  useEffect(() => {
    const fetchData = async () => {
      const res = await getClassroom(classroomId);
      if (res.data) {
        const classroom = res.data;
        setClassroom(classroom);
        setGradeId(classroom.grade.id);
        classroom.selections.forEach(async (selection) => {
          if (selection.current) {
            const lsRes = await getLearningStandard(
              selection.learning_standard
            );
            if (lsRes.data) setActiveLearningStandard(lsRes.data);
            else {
              message.error(lsRes.err);
            }
            const daysRes = await getLearningStandardDays(lsRes.data.id);
            if (daysRes) setDays(daysRes.data);
            else {
              message.error(daysRes.err);
            }
          }
        });
      } else {
        message.error(res.err);
      }
    };
    fetchData();
  }, [classroomId]);

  const handleViewMentorSandbox = (day) => {
    //console.log("howdy howdy");
    setMyDayLOL(day.id)
    setSandboxVisible(true);
  };

  const handleViewMentorSandboxMentor = (day) => {
    setMyDayLOL(day.id);
    setSandboxVisibleMentor(true);
  };

  const handleViewDay = (day, name) => {
    day.learning_standard_name = name;
    day.template = day.multi_template[0].template
    localStorage.setItem('sandbox-day', JSON.stringify(day));
    localStorage.setItem("sandbox", true)
    navigate('/sandbox');
  };

  const openActivityInWorkspace = (day, name) => {
    day.learning_standard_name = name;
    day.template = day.activity_template;
    delete day.id;
    delete day.activity_template;
    localStorage.setItem('sandbox-day', JSON.stringify(day));
    navigate('/sandbox');
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const color = [
    'magenta',
    'purple',
    'green',
    'cyan',
    'red',
    'geekblue',
    'volcano',
    'blue',
    'orange',
    'gold',
    'lime',
  ];

  return (
    <div>
      <button id='home-back-btn' onClick={handleBack}>
        <i className='fa fa-arrow-left' aria-hidden='true' />
      </button>
      <DisplayCodeModal code={classroom.code} />
      <MentorSubHeader title={classroom.name}></MentorSubHeader>
      <div id='home-content-container'>
        <div id='active-learning-standard'>
          {activeLearningStandard ? (
            <div>
              <div id='active-learning-standard-title-container'>
                <h3>{`Learning Standard - ${activeLearningStandard.name}`}</h3>
                <LearningStandardModal
                  setActiveLearningStandard={setActiveLearningStandard}
                  classroomId={classroomId}
                  gradeId={gradeId}
                  viewing={viewing}
                  setDays={setDays}
                />
              </div>
              <p id='learning-standard-expectations'>{`Expectations: ${activeLearningStandard.expectations}`}</p>
             {activeLearningStandard.link ? (
                <p>
                  Addtional resources to the lesson:{' '}
                  <a
                    href={activeLearningStandard.link}
                    target='_blank'
                    rel='noreferrer'
                  >
                    {activeLearningStandard.link}
                  </a>
                </p>
              ) : null}
              {days ? (
                <div id='card-btn-container' className='flex space-between'>
                  {days.map((day) => (
                    <div id='view-day-card' key={day.id}>
                      <div id='day-title'>
                       Day {day.number}
                       </div>
                      <div id='view-day-heading' style={{display: "flex"}}>
                        
                        <button
                          id='view-day-button'
                          style={{marginRight: "auto"}}
                          onClick={() => handleViewMentorSandbox(day)}
                        >
                          Student Template
                        </button>
                        {day.activity_template && (
                          <button
                            id='view-day-button'
                            style={{marginRight: "auto"}}
                            onClick={() =>
                              handleViewMentorSandboxMentor(day)
                            }
                          >
                            Mentor Template
                          </button>
                        )}
                        {sandboxVisible ? (
                          <MentorSandbox
                            thisDay={myDayLOL}
                            viewing={sandboxVisible}
                            setViewing={setSandboxVisible}
                            learningStandard={activeLearningStandard}
                            />
                          ) : null}
                        {sandboxVisibleMentor ? (
                          <MentorSandboxMentor
                            thisDay={myDayLOL}
                            viewing={sandboxVisibleMentor}
                            setViewing={setSandboxVisibleMentor}
                            learningStandard={activeLearningStandard}
                            />
                          ) : null}
                        <MentorDayDetailModal 
                          learningStandard={activeLearningStandard}
                          selectDay={day}
                          dayDetailsVisible={false}
                          setDayDetailsVisible={false}
                          setDays={setDays}
                          viewing={false}
                        />
                      </div>
                      <div id='view-day-info'>
                        <p>
                          <strong>TEKS: </strong>
                          {day.TekS}
                        </p>
                        <p>
                          <strong>Description: </strong>
                          {day.description}
                        </p>
                        <p>
                          <strong>Classroom Materials: </strong>
                          {day.learning_components
                            .filter(
                              (component) =>
                                component.learning_component_type === SCIENCE
                            )
                            .map((element, index) => {
                              return (
                                <Tag
                                  key={index}
                                  color={color[(index + 1) % 11]}
                                >
                                  {element.type}
                                </Tag>
                              );
                            })}
                        </p>
                        <p>
                          <strong>Student Materials: </strong>
                          {day.learning_components
                            .filter(
                              (component) =>
                                component.learning_component_type === MAKING
                            )
                            .map((element, index) => {
                              return (
                                <Tag
                                  key={index}
                                  color={color[(index + 4) % 11]}
                                >
                                  {element.type}
                                </Tag>
                              );
                            })}
                        </p>
                        <p>
                          <strong>Arduino Components: </strong>
                          {day.learning_components
                            .filter(
                              (component) =>
                                component.learning_component_type ===
                                COMPUTATION
                            )
                            .map((element, index) => {
                              return (
                                <Tag
                                  key={index}
                                  color={color[(index + 7) % 11]}
                                >
                                  {element.type}
                                </Tag>
                              );
                            })}
                        </p>
                        {day.link ? (
                          <p>
                            <strong>Link to Additional Information: </strong>
                            <a href={day.link} target='_blank' rel='noreferrer'>
                              {day.link}
                            </a>
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <div>
              <p>There is currently no active lesson set.</p>
              <p>Click the button below to browse available lessons.</p>
              <LearningStandardModal
                setActiveLearningStandard={setActiveLearningStandard}
                classroomId={classroomId}
                gradeId={gradeId}
                viewing={viewing}
                setDays={setDays}
              />
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
