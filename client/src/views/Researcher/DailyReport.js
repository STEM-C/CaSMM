import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'antd';
import './DailyReport.less';

import NavBar from '../../components/NavBar/NavBar';
import ReportDropdown from '../../components/DropdownMenu/ReportDropdown';
import {
  getAllStudents,
  getDays,
  getAllClassrooms,
  getTeachers,
  getAllUnits,
  getGrades,
  getAllSessions
} from "../../Utils/requests";

export default function DailyReport() {

  const [teachers, setTeachers] = useState([])
  const [classRooms, setClassrooms] = useState([])
  const [students, setStudents] = useState([])
  const [grades, setGrades] = useState([])
  const [days, setDays] = useState([])
  const [units, setUnits] = useState([])
  const [sessions, setSessions] = useState([])

  useEffect(function() {

    async function getAllData() {
      const studentsP = getAllStudents();
      const gradesP = getGrades()
      const unitsP = getAllUnits()
      const teachersP = getTeachers()
      const classroomsP = getAllClassrooms()
      const daysP = getDays()
      const sessionsP = getAllSessions();
      const [students, grades, units, teachers, classrooms, days, sessions] = await Promise.all([studentsP, gradesP, unitsP, teachersP, classroomsP, daysP, sessionsP]);

      const fetchedStudents = students.data.map(student => student.name + "_" + student.id)
      setStudents(fetchedStudents);

      const fetchedGrades = grades.data.map(grade => grade.name);
      setGrades(fetchedGrades)

      const fetchedUnits = units.data.map(unit => unit.name);
      setUnits(fetchedUnits)

      const mentors = teachers.data.map(teacher => teacher.first_name + " " + teacher.last_name);
      setTeachers(mentors)

      const classRoomNumbers = classrooms.data.map(room => room.name);
      setClassrooms(classRoomNumbers)

      const fetchedDays = days.data.map(day => day.id)
      setDays(fetchedDays)

      const formattedSessions = sessions.data.map(session => {
        return {...session, student: session.students[0].name, hasPartners: session.students.length > 1 ? 'Yes' : 'No'}
      })
      setSessions(formattedSessions);
    }
    getAllData();
  }, [])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '5%',
      align: 'left',
      sorter: {
        compare: (a, b) => (a.name < b.name ? -1 : 1),
      },
    },
    {
      title: 'Student',
      dataIndex: 'student',
      key: 'student',
      width: '10%',
      align: 'left',
    },
    {
      title: 'Session Started',
      dataIndex: 'created_at',
      key: 'created_at',
      width: '10%',
      align: 'left',
      sorter: {
        compare: (a, b) => (a.last_logged_in < b.last_logged_in ? -1 : 1),
      }
      // render: (_, record) => getFormattedDate(record.last_logged_in),
    },
    {
      title: 'Partners',
      dataIndex: 'hasPartners',
      key: 'hasPartners',
      width: '3%',
      align: 'right'
    },
    {
      title: 'View Report',
      dataIndex: 'enrolled',
      key: 'enrolled',
      width: '10%',
      align: 'right',
      render: (_, session) => <Link to={`/daylevel/${session.id}`}>View Report</Link>
      // filters: [
      //   {
      //     text: 'Enrolled',
      //     value: true,
      //   },
      //   {
      //     text: 'Unenrolled',
      //     value: false,
      //   },
      // ],
      // filterMultiple: false,
      // onFilter: (value, record) => record.enrolled.enrolled === value,
    },
  ];
  console.log(sessions);
  return (
    <div className="container nav-padding">
      <NavBar />
      <div className="menu-bar">
        <div id="daily-report-header">Day Level - Student Report</div>
        
        {/* Menu to return to landing page at /reports */}
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
        <div className="cards">
          <section id="container-section-day">
            <section>
              <ReportDropdown label="Teacher Name: " menuName="Teacher Name" menuItems={teachers}/>
              <br />
              <ReportDropdown label="Classroom Number: " menuName="Classroom Number" menuItems={classRooms}/>
              <br />
              <ReportDropdown label="Select Student: " menuName="Select Student" menuItems={students}/>
            </section>
            <section>
              <ReportDropdown label="Unit Name: " menuName="Unit Name" menuItems={units}/>
              <br />
              <ReportDropdown label="Day: " menuName="Day" menuItems={days}/>
              <br />
              
              <ReportDropdown label="Student's Partner Name HERE??: " menuName="Grade" menuItems={grades}/>
              <button type="button" className="btn btn-outline-primary"><a href="">Generate Report</a></button>
            </section>
          </section>
        </div>
        <Table
          columns={columns}
          dataSource={sessions}
        />
      </main>
    </div>
  );
}
