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
  getGrades,
  getAllSessions
} from "../../Utils/requests";

export default function DailyReport() {

  const [classRooms, setClassrooms] = useState([])
  const [students, setStudents] = useState([])
  const [grades, setGrades] = useState([])
  const [days, setDays] = useState([])
  const [sessions, setSessions] = useState([])

  useEffect(function() {

    async function getAllData() {
      const studentsP = getAllStudents();
      const gradesP = getGrades()
      const classroomsP = getAllClassrooms()
      const daysP = getDays()
      const sessionsP = getAllSessions();
      const [students, grades, classrooms, days, sessions] = await Promise.all([studentsP, gradesP, classroomsP, daysP, sessionsP]);

      const fetchedStudents = students.data.map(student => {
        var filter = {
          text: student.name + ' ' + student.id,
          value: student.name + ' ' + student.id
        }
        return filter
      })
      setStudents(fetchedStudents);

      const fetchedGrades = grades.data.map(grade => {
        console.log("Grade: ", grade)
        var Grade = {
          text: grade.id,
          value: grade.id
        }
        return Grade
      });
      setGrades(fetchedGrades)

      const classRoomNames = classrooms.data.map(room => {
        var classRoom = {
          text: room.name,
          value: room.name
        }
        return classRoom
      });
      setClassrooms(classRoomNames)

      const fetchedDays = days.data.map(day => {
        var Day = {
          text: day.id,
          value: day.id
        }
        return Day
      })
      setDays(fetchedDays)

      const formattedSessions = sessions.data.map(session => {
        return {
          ...session, 
          student: session.students[0].name + ' ' + session.students[0].id, 
          hasPartners: session.students.length > 1 ? 'Yes' : 'No'}
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
      width: '3%',
      align: 'left',
      sorter: {
        compare: (a, b) => (a.name < b.name ? -1 : 1),
      },
    },
    {
      title: 'Student',
      dataIndex: 'student',
      key: 'student',
      width: '3%',
      align: 'left',
      filters: students,
      onFilter: (value, record) => record.student === value,
    },
    {
      title: 'Classroom',
      dataIndex: ['classroom', 'name'],
      width: '3%',
      align: 'right',
      filters: classRooms,
      onFilter: (value, record) => record.classroom.name === value,
    },
    {
      title: 'Grade',
      dataIndex: ['classroom', 'grade'],
      width: '3%',
      align: 'right',
      filters: grades,
      onFilter: (value, record) => record.classroom.grade === value,
    },
    {
      title: 'Day',
      dataIndex: ['submissions', '0', 'day'],
      width: '3%',
      align: 'right',
      filters: days,
      onFilter: (value, record) => {
        console.log("Day Record: ", record)
        console.log("Value: ", value)
        return record.submissions.grade === value
      },
    },
    {
      title: 'Session Started',
      dataIndex: 'created_at',
      key: 'created_at',
      width: '3%',
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
      align: 'right',
      filters: [
        {
          text: 'Yes',
          value: 'Yes',
        },
        {
          text: 'No',
          value: 'No',
        },
      ],
      filterMultiple: false,
      onFilter: (value, record) => record.hasPartners === value,
    },
    {
      title: 'View Report',
      dataIndex: 'enrolled',
      key: 'enrolled',
      width: '3%',
      align: 'right',
      render: (_, session) => <Link to={`/daylevel/${session.id}`}>View Report</Link>
    },
  ];
  console.log(sessions);
  console.log("Students: ", students)
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
        <Table
          columns={columns}
          dataSource={sessions}
        />
      </main>
    </div>
  );
}
