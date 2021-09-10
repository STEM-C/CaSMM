import React, { useState, useEffect } from 'react';

import { Tabs, Table, Popconfirm, message } from 'antd';
import Navbar from '../../components/NavBar/NavBar';
import { QuestionCircleOutlined } from '@ant-design/icons';

import UnitCreator from './UnitCreator/UnitCreator';
import LearningStandardDayCreator from './LearningStandardCreator/LearningStandardCreator';
import {
  getLearningStandardAll,
  deleteLearningStandard,
  getGrades,
} from '../../Utils/requests';
import UnitEditor from './UnitEditor/UnitEditor';
import LessonEditor from './LessonEditor/LessonEditor';

import './ContentCreator.less';

const { TabPane } = Tabs;

export default function ContentCreator({ history }) {
  const [gradeList, setGradeList] = useState([]);
  const [learningStandardList, setLearningStandardList] = useState([]);
  const [viewing, setViewing] = useState(
    parseInt(history.location.hash.split('#')[1])
  );

  useEffect(() => {
    const fetchData = async () => {
      const [lsResponse, gradeResponse] = await Promise.all([
        getLearningStandardAll(),
        getGrades(),
      ]);
      await setLearningStandardList(lsResponse.data);

      const grades = await gradeResponse.data;
      grades.sort((a, b) => (a.id > b.id ? 1 : -1));
      setGradeList(grades);
    };
    fetchData();
  }, []);

  const columns = [
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
      editable: true,
      width: '22.5%',
      align: 'left',
      render: (_, key) => (
        <UnitEditor id={key.unit.id} unitName={key.unit.name} linkBtn={true} />
      ),
    },
    {
      title: 'Lesson',
      dataIndex: 'name',
      key: 'name',
      editable: true,
      width: '22.5%',
      align: 'left',
      render: (_, key) => (
        <LessonEditor
          learningStandard={key}
          history={history}
          linkBtn={true}
          viewing={viewing}
          setViewing={setViewing}
        />
      ),
    },
    {
      title: 'Description',
      dataIndex: 'expectations',
      key: 'character',
      editable: true,
      width: '22.5%',
      align: 'left',
    },
    {
      title: 'Delete',
      dataIndex: 'delete',
      key: 'delete',
      width: '10%',
      align: 'right',
      render: (_, key) => (
        <Popconfirm
          title={'Are you sure you want to delete this learning standard?'}
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          onConfirm={async () => {
            await deleteLearningStandard(key.id);
            setLearningStandardList(
              learningStandardList.filter((ls) => {
                return ls.id !== key.id;
              })
            );
            message.success('Delete success');
          }}
        >
          <button id={'link-btn'}>Delete</button>
        </Popconfirm>
      ),
    },
  ];

  const filterLS = (grade) => {
    return learningStandardList.filter((learningStandard) => {
      return learningStandard.unit.grade === grade.id;
    });
  };

  const setTabs = (grade) => {
    return (
      <TabPane tab={grade.name} key={grade.name}>
        <div id='page-header'>
          <h1>Lessons & Units</h1>
        </div>
        <div id='content-creator-table-container'>
          <div id='content-creator-btn-container'>
            <UnitCreator gradeList={gradeList} />
            <LearningStandardDayCreator />
          </div>
          <Table
            columns={columns}
            dataSource={filterLS(grade)}
            rowClassName='editable-row'
          ></Table>
        </div>
      </TabPane>
    );
  };

  return (
    <div className='container nav-padding'>
      <Navbar isContentCreator={true} />
      <div id='main-header'>Welcome Content Creator</div>

      <Tabs>
        <TabPane tab='Home' key='home'>
          <div id='page-header'>
            <h1>Lessons & Units</h1>
          </div>
          <div id='content-creator-table-container'>
            <div id='content-creator-btn-container'>
              <UnitCreator gradeList={gradeList} />
              <LearningStandardDayCreator
                setLearningStandardList={setLearningStandardList}
                history={history}
                viewing={viewing}
                setViewing={setViewing}
              />
            </div>
            <Table
              columns={columns}
              dataSource={learningStandardList}
              rowClassName='editable-row'
            ></Table>
          </div>
        </TabPane>

        {gradeList.map((grade) => {
          return setTabs(grade);
        })}
      </Tabs>
    </div>
  );
}
