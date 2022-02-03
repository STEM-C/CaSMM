import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Table, Select, Button } from 'antd';
import './DayLevelReport.less';

import NavBar from '../../components/NavBar/NavBar';
import {
  getSessions,
  getSessionCount,
  getGrades,
  getUnit,
  getGrade,
} from '../../Utils/requests';
import Form from 'antd/lib/form/Form';

const DayLevelReport = () => {
  const [sessions, setSessions] = useState([]);
  const [sessionCount, setSessionCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    setSearchParams({
      page: searchParams.has('page') ? searchParams.get('page') : 1,
      _sort: searchParams.has('_sort')
        ? searchParams.get('_sort')
        : 'created_at:DESC',
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      let sort = searchParams.get('_sort');
      let start = (searchParams.get('page') - 1) * 10;
      let options = {
        grade: searchParams.get('grade'),
        unit: searchParams.get('unit'),
        learning_standard: searchParams.get('learning_standard'),
        classroom: searchParams.get('classroom'),
      };
      let path = `http://localhost:1337/api/sessions?_sort=${sort}&_start=${start}&_limit=10`;
      if (options.grade) path += `&grade=${options.grade}`;
      if (options.unit) path += `&unit=${options.unit}`;
      if (options.learning_standard)
        path += `&learning_standard=${options.learning_standard}`;
      if (options.classroom) path += `&classroom=${options.classroom}`;
      // getSessions((searchParams.get('page') - 1) * 10, sort, options),
      const [sessionRes, sessionCountRes] = await Promise.all([
        getSessions(path),
        getSessionCount(),
      ]);
      console.log(sessionRes);
      if (sessionRes.error) {
        console.error(sessionRes.error);
      }
      setSessions(sessionRes.data);
      console.log(sessionRes.data);

      setSessionCount(sessionCountRes.data);
    };
    if (searchParams.has('page') && searchParams.has('_sort')) {
      fetchData();
    }
  }, [searchParams]);

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
      sortOrder:
        searchParams.get('_sort') === 'created_at:DESC' ? 'descend' : 'ascend',
      sortDirections:
        searchParams.get('_sort') === 'created_at:DESC'
          ? ['ascend', 'descend', 'ascend']
          : ['descend', 'ascend', 'descend'],
      onHeaderCell: () => {
        return {
          onClick: () => {
            const page = searchParams.get('page');
            const _sort =
              searchParams.get('_sort') === 'created_at:DESC'
                ? 'created_at:ASC'
                : 'created_at:DESC';
            setSearchParams({ page, _sort });
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
  return (
    <div className='container nav-padding'>
      <NavBar searchParams={searchParams} setSearchParams={setSearchParams} />
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
      <Filter />
      <main id='day-report-content-wrapper'>
        <Table
          columns={columns}
          dataSource={sessions}
          rowKey='id'
          onChange={(Pagination) => {
            console.log(Pagination);
            setSearchParams({
              page: Pagination.current,
              _sort: searchParams.get('_sort'),
            });
          }}
          pagination={{
            defaultCurrent: searchParams.get('page'),
            showQuickJumper: true,
            defaultPageSize: 10,
            total: sessionCount,
          }}
        />
      </main>
    </div>
  );
};

const { Option } = Select;
const Filter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [grades, setGrades] = useState([]);
  const [ls, setLs] = useState([]);
  const [units, setUnits] = useState([]);
  const [classrooms, setClassrooms] = useState([]);

  const [selectedGrade, setselectedGrade] = useState('');
  const [selectedLs, setselectedLs] = useState('');
  const [selectedUnit, setselectedUnit] = useState('');
  const [selectedClassroom, setselectedClassroom] = useState('');

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

  const onGradeChange = async (grade) => {
    if (grade) {
      setselectedGrade(grade);
      const gradeRes = await getGrade(grade);
      setUnits(gradeRes.data.units);
      setClassrooms(gradeRes.data.classrooms);
    } else {
      setselectedGrade('');
      setUnits([]);
      setClassrooms([]);
      setLs([]);
    }
  };

  const onUnitChange = async (unit) => {
    if (unit) {
      setselectedUnit(unit);
      const unitRes = await getUnit(unit);
      setLs(unitRes.data.learning_standards);
    } else {
      setselectedUnit('');
      setLs([]);
    }
  };

  const handleSubmit = async () => {
    const page = searchParams.get('page');
    const _sort = searchParams.get('_sort');
    let paramObj = { page, _sort };
    if (selectedGrade !== '') paramObj.grade = selectedGrade;
    if (selectedUnit !== '') paramObj.unit = selectedUnit;
    if (selectedLs !== '') paramObj.learning_standard = selectedLs;
    if (selectedClassroom !== '') paramObj.classroom = selectedClassroom;
    setSearchParams(paramObj);
  };

  return (
    <Form onFinish={handleSubmit}>
      <Select
        showSearch={true}
        placeholder='Select a grade'
        onChange={onGradeChange}
        optionFilterProp='children'
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        filterSort={(optionA, optionB) =>
          optionA.children
            .toLowerCase()
            .localeCompare(optionB.children.toLowerCase())
        }
      >
        <Option key='empty' value=''>
          {''}
        </Option>
        {grades.map((grade) => (
          <Option key={grade.id} value={grade.id}>
            {grade.name}
          </Option>
        ))}
      </Select>
      <Select
        showSearch={true}
        placeholder='Select a unit'
        disabled={units.length === 0}
        onChange={onUnitChange}
        optionFilterProp='children'
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        filterSort={(optionA, optionB) =>
          optionA.children
            .toLowerCase()
            .localeCompare(optionB.children.toLowerCase())
        }
      >
        <Option key='empty' value=''>
          {''}
        </Option>
        {units.map((unit) => (
          <Option key={unit.id} value={unit.id}>
            {unit.name}
          </Option>
        ))}
      </Select>
      <Select
        showSearch={true}
        placeholder='Select a lesson'
        disabled={ls.length === 0}
        onChange={(val) => {
          setselectedLs(val);
        }}
        optionFilterProp='children'
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        filterSort={(optionA, optionB) =>
          optionA.children
            .toLowerCase()
            .localeCompare(optionB.children.toLowerCase())
        }
      >
        <Option key='empty' value=''>
          {''}
        </Option>
        {ls.map((lesson) => (
          <Option key={lesson.id} value={lesson.id}>
            {lesson.name}
          </Option>
        ))}
      </Select>
      <br />
      <Select
        showSearch={true}
        placeholder='Select a classroom'
        disabled={classrooms.length === 0}
        onChange={(val) => {
          setselectedClassroom(val);
        }}
        optionFilterProp='children'
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        filterSort={(optionA, optionB) =>
          optionA.children
            .toLowerCase()
            .localeCompare(optionB.children.toLowerCase())
        }
      >
        <Option key='empty' value=''>
          {''}
        </Option>
        {classrooms.map((classroom) => (
          <Option key={classroom.id} value={classroom.id}>
            {classroom.name}
          </Option>
        ))}
      </Select>
      <br />
      <Button type='secondary' htmlType='submit' size='large'>
        Submit
      </Button>
    </Form>
  );
};

export default DayLevelReport;
