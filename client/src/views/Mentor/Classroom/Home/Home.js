import React, { useEffect, useState } from 'react';
import './Home.less';
import {
  getClassroom,
  getLearningStandard,
  getLearningStandardDays,
} from '../../../../Utils/requests';
import MentorSubHeader from '../../../../components/MentorSubHeader/MentorSubHeader';
import DisplayCodeModal from './DisplayCodeModal';
import LearningStandardModal from './LearningStandardSelect/LearningStandardModal';
import { message, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function Home({ classroomId, viewing }) {
  const [classroom, setClassroom] = useState({});
  const [days, setDays] = useState([]);
  const [gradeId, setGradeId] = useState(null);
  const [activeLearningStandard, setActiveLearningStandard] = useState(null);

  const navigate = useNavigate();

  const SCIENCE = 1;
  const MAKING = 2;
  const COMPUTATION = 3;

  useEffect(() => {
    const fetchData = async () => {
      sessionStorage.setItem('classroomId', classroomId);
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
            console.log(daysRes.data);
          }
        });
      } else {
        message.error(res.err);
      }
    };
    fetchData();
  }, [classroomId]);

  const handleViewDay = (day, name) => {
    day.learning_standard_name = name;
    localStorage.setItem('my-day', JSON.stringify(day));
    navigate('/day');
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
                      <h3
                        onClick={() =>
                          handleViewDay(day, activeLearningStandard.name)
                        }
                        id='view-day-title'
                      >{`View Day ${day.number}`}</h3>
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
                          <strong>Science Components: </strong>
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
                          <strong>Making Components: </strong>
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
                          <strong>Computation Components: </strong>
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
