import React, { useState, useEffect } from 'react';

import { Tabs, Table, Popconfirm } from 'antd';
import Navbar from '../../components/NavBar/NavBar';
import { QuestionCircleOutlined } from '@ant-design/icons';

import DayEditor from './LearningStandardDayCreator/DayEditor';
import UnitCreator from './UnitCreator/UnitCreator';
import LearningStandardDayCreator from './LearningStandardCreator/LearningStandardCreator';
import {
  getLearningStandardAll,
  deleteLearningStandard,
  getGrades,
} from '../../Utils/requests';
import UnitEditor from './UnitEditor/UnitEditor';

import './ContentCreator.less';

const { TabPane } = Tabs;

export default function ContentCreator(props) {
  const [gradeList, setGradeList] = useState([]);
  const [learningStandardList, setLearningStandardList] = useState([]);

  useEffect(() => {
    const getLearningStandardList = async () => {
      const response = await getLearningStandardAll();
      // console.log(response.data);
      setLearningStandardList(response.data);
    };
    getLearningStandardList();
  }, []);

  useEffect(() => {
    const getGradeList = async () => {
      const response = await getGrades();
      // console.log(response.data);
      response.data.sort((a, b) => (a.id > b.id ? 1 : -1));
      setGradeList(response.data);
    };
    getGradeList();
  }, []);

  const columns = [
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
      editable: true,
      width: '22.5%',
      align: 'left',
      render: (_, key) => <UnitEditor id={key.unit.id} linkBtn={true} />,
    },
    {
      title: 'Learning Standard',
      dataIndex: 'name',
      key: 'name',
      editable: true,
      width: '22.5%',
      align: 'left',
      render: (_, key) => (
        <DayEditor history={props.history} learningStandard={key} />
      ),
    },
    {
      title: 'Desciption',
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
          onConfirm={() => {
            deleteLearningStandard(key.id);
          }}
        >
          <button id={'link-btn'}>Delete</button>
        </Popconfirm>
      ),
    },
  ];

  const filterLS = (grade) => {
    return learningStandardList.filter((learningStandard) => {
      return learningStandard.unit.grade === grade.name;
    });
  };

  const setTabs = (grade) => {
    return (
      <TabPane tab={grade.name} key={grade.name}>
        <div id='page-header'>
          <h1>Learning Standards & Units:</h1>
        </div>
        <div id='table-container'>
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
            <h1>Learning Standards & Units</h1>
          </div>
          <div id='content-creator-table-container'>
            <div id='content-creator-btn-container'>
              <UnitCreator gradeList={gradeList} />
              <LearningStandardDayCreator />
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
