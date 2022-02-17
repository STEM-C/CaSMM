import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Table, Button, Tag, Modal } from 'antd';
import './DayLevelReport.less';
import { useSearchParam } from '../../Utils/useSearchParam';
import NavBar from '../../components/NavBar/NavBar';
import {
  getSessionsWithFilter,
  getSessionCountWithFilter,
  getGrades,
  getUnit,
  getGrade,
  getClassroom,
} from '../../Utils/requests';
import Form from 'antd/lib/form/Form';

const DayLevelReport = () => {
  const [sessions, setSessions] = useState([]);
  const [sessionCount, setSessionCount] = useState(0);
  const navigate = useNavigate();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const { paramObj, setSearchParam } = useSearchParam();

  useEffect(() => {
    const fetchData = async () => {
      let filter = '';
      for (const [k, v] of Object.entries(paramObj)) {
        switch (k) {
          case '_start':
            filter += `_start=${v}&`;
            break;
          case '_sort':
            filter += `_sort=${v}&`;
            break;
          default:
            filter += `${k}=${v}&`;
        }
      }
      filter += '_limit=10';
      const [sessionRes, sessionCountRes] = await Promise.all([
        getSessionsWithFilter(filter),
        getSessionCountWithFilter(filter),
      ]);
      if (sessionRes.error) {
        console.error(sessionRes.error);
      }
      setSessions(sessionRes.data);
      setSessionCount(sessionCountRes.data);
    };
    // console.log(paramObj);
    if (paramObj['_sort']) fetchData();
  }, [paramObj]);

  const formatMyDate = (value, locale = 'en-US') => {
    let output = new Date(value).toLocaleDateString(locale);
    return output + ' ' + new Date(value).toLocaleTimeString(locale);
  };

  const columns = [
    {
      title: 'Student',
      key: 'student',
      width: '2%',
      align: 'left',
      render: (_, key) => <div>{key.students[0].name}</div>,
    },
    {
      title: 'Classroom',
      key: 'classroom',
      dataIndex: ['classroom', 'name'],
      width: '6%',
      align: 'left',
    },
    {
      title: 'Grade',
      dataIndex: ['grade', 'name'],
      key: 'grade',
      width: '2%',
      align: 'left',
    },
    {
      title: 'Unit',
      dataIndex: ['unit', 'name'],
      key: 'unit',
      width: '4%',
      align: 'left',
    },
    {
      title: 'Lesson',
      dataIndex: ['learning_standard', 'name'],
      key: 'unit',
      width: '3%',
      align: 'left',
    },
    {
      title: 'Session Started',
      dataIndex: 'created_at',
      key: 'sessionStart',
      width: '4%',
      align: 'left',
      sorter: true,
      sortOrder: paramObj['_sort'] === 'created_at:DESC' ? 'descend' : 'ascend',
      sortDirections:
        paramObj['_sort'] === 'created_at:DESC'
          ? ['ascend', 'descend', 'ascend']
          : ['descend', 'ascend', 'descend'],
      onHeaderCell: () => {
        return {
          onClick: () => {
            const _start = paramObj['_start'];
            const _sort =
              paramObj['_sort'] === 'created_at:DESC'
                ? 'created_at:ASC'
                : 'created_at:DESC';
            setSearchParam({ _start, _sort });
          },
        };
      },
      render: (_, key) => <div>{formatMyDate(key.created_at)}</div>,
    },
    {
      title: 'Partners',
      key: 'hasPartners',
      width: '2%',
      align: 'left',
      render: (_, key) => (
        <div>
          {key.students
            .slice(1)
            .map((student) => student.name)
            .join(', ')}
        </div>
      ),
    },
    {
      title: 'View Report',
      dataIndex: 'enrolled',
      key: 'enrolled',
      width: '2%',
      align: 'right',
      render: (_, session) => (
        <Link to={`/daylevel/${session.id}`}>View Report</Link>
      ),
    },
  ];



  const showModal = () => {
    setIsModalVisible(true);
  };


  return (
    <div className='container nav-padding'>
      <NavBar />
      <div className='menu-bar'>
        <div id='day-level-report-header'>Day Level - Student Report</div>

        {/* Menu to return to landing page at /reports */}
        <button
          id={'day-level-return'}
          className={`btn-${'primary'} btn-${'sm'}`}
          type='button'
          onClick={() => navigate('/report')}
        >
          Return to Dashboard
        </button>
      </div>
      <div className='filter-container'>
       <button className='filter-btn' onClick={showModal}>
          Filter 
        </button>
        <Modal title="Filter" visible={isModalVisible} footer={null}>
          <Filter setSearchParam={setSearchParam} />
        </Modal>
        <div className='current-filter-container'>
            <h3>Current Filter: </h3>
            {Object.keys(paramObj).map((key) => (
              <Tag>
                {key === 'grade' ? `${key}(id)` : key}: {paramObj[key]}
              </Tag>
            ))}
          </div>
      </div>
      <main id='day-report-content-wrapper'>
        <Table
          columns={columns}
          dataSource={sessions}
          rowKey='id'
          onChange={(Pagination) => {
            setSearchParam({
              _start: (Pagination.current - 1) * 10,
              _sort: paramObj['_sort'],
            });
          }}
          pagination={{
            current: paramObj['_start'] / 10 + 1 || 1,
            showQuickJumper: true,
            defaultPageSize: 10,
            total: sessionCount,
          }}
        />
      </main>
    </div>
  );
};
const Filter = ({ setSearchParam }) => {
  const [grades, setGrades] = useState([]);
  const [ls, setLs] = useState([]);
  const [units, setUnits] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedGrade, setselectedGrade] = useState('');
  const [selectedLs, setselectedLs] = useState('');
  const [selectedUnit, setselectedUnit] = useState('');
  const [selectedClassroom, setselectedClassroom] = useState('');
  const [selectedStudent, setselectedStudent] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const gradesRes = await getGrades();
      if (gradesRes.error) {
        console.error('Fail to retrive grades');
      }
      setGrades(gradesRes.data);
    };
    fetchData();
  }, []);

  const onGradeChange = async (e) => {
    setselectedUnit('');
    setselectedLs('');
    setselectedClassroom('');
    setselectedStudent('');
    setClassrooms([]);
    setLs([]);
    setStudents([]);

    const grade = e.target.value;
    if (grade) {
      setselectedGrade(grade);
      const gradeRes = await getGrade(grade);
      setUnits(gradeRes.data.units);
      setClassrooms(gradeRes.data.classrooms);
    } else {
      setselectedGrade('');
      setUnits([]);
    }
  };

  const onUnitChange = async (e) => {
    setselectedLs('');
    const unit = e.target.value;
    if (unit) {
      setselectedUnit(unit);
      const unitRes = await getUnit(unit);
      setLs(unitRes.data.learning_standards);
    } else {
      setselectedUnit('');
      setLs([]);
    }
  };

  const onClassroomChange = async (e) => {
    setselectedStudent('');
    const classroom = e.target.value;
    if (classroom) {
      setselectedClassroom(classroom);
      const classroomRes = await getClassroom(classroom);
      setStudents(classroomRes.data.students);
    } else {
      setselectedClassroom('');
      setStudents([]);
    }
  };

  const handleSubmit = async () => {
    let obj = {};
    if (selectedGrade !== '') obj.grade = selectedGrade;
    if (selectedUnit !== '') obj.unit = selectedUnit;
    if (selectedLs !== '') obj.learning_standard = selectedLs;
    if (selectedClassroom !== '') obj.classroom = selectedClassroom;
    if (selectedStudent !== '') obj.student = selectedStudent;
    console.log(obj);
    setSearchParam(obj);
    // setIsModalVisible(false);
  };

  return (
    <Form onFinish={handleSubmit}>
      <select 
        className='select'
        placeholder='Select a grade' 
        onChange={onGradeChange}>
        <option key='empty' value=''>
          Select a grade
        </option>
        {grades.map((grade) => (
          <option key={grade.id} value={grade.id}>
            {grade.name}
          </option>
        ))}
      </select>
      <select
        className='select'
        placeholder='Select a unit'
        disabled={units.length === 0 || selectedClassroom != ''}
        onChange={onUnitChange}
      >
        <option key='empty' value=''>
          Select a unit
        </option>
        {units.map((unit) => (
          <option key={unit.id} value={unit.id}>
            {unit.name}
          </option>
        ))}
      </select>
      <select
        className='select'
        placeholder='Select a lesson'
        disabled={ls.length === 0}
        onChange={(e) => {
          setselectedLs(e.target.value);
        }}
      >
        <option key='empty' value=''>
          Select a lesson
        </option>
        {ls.map((lesson) => (
          <option key={lesson.id} value={lesson.id}>
            {lesson.name}
          </option>
        ))}
      </select>
      <h3>Or</h3>
      <select
        className='select'
        placeholder='Select a classroom'
        disabled={classrooms.length === 0 || selectedUnit != ''}
        onChange={onClassroomChange}
      >
        <option key='empty' value=''>
          Select a classroom
        </option>
        {classrooms.map((classroom) => (
          <option key={classroom.id} value={classroom.id}>
            {classroom.name}
          </option>
        ))}
      </select>
      <select
        className='select'
        placeholder='Select a student'
        disabled={students.length === 0}
        onChange={(e) => {
          setselectedStudent(e.target.value);
        }}
      >
        <option key='empty' value=''>
          Select a student
        </option>
        {students.map((stuent) => (
          <option key={stuent.id} value={stuent.id}>
            {stuent.name}
          </option>
        ))}
      </select>
      <br />
      <Button type='secondary' htmlType='submit' size='large'>
        Submit
      </Button>
    </Form>
  );
};

export default DayLevelReport;
