import NavBar from '../../components/NavBar/NavBar';
import ReportDropdown from '../../components/DropdownMenu/ReportDropdown';
import React, {useEffect, useState} from 'react';
import './DailyReport.less';
import {
  getAllStudents,
  getDays,
  getAllClassrooms,
  getTeachers,
  getAllUnits,
  getGrades
} from "../../Utils/requests";
import { Link } from 'react-router-dom';

export default function DailyReport(props) {

  const [teachers, setTeachers] = useState([])
  const [classRooms, setClassrooms] = useState([])
  const [students, setStudents] = useState([])
  const [grades, setGrades] = useState([])
  const [days, setDays] = useState([])
  const [units, setUnits] = useState([])

  useEffect(async function() {
    getAllStudents()
      .then(data => {
        console.log("Students: ", data)
        let fetchedStudents = []
        data.data.forEach(student =>  {
          fetchedStudents.push(student.name + "_" + student.id)
        })
        setStudents(fetchedStudents)
      })

    getDays()
      .then(data => {
        console.log("Days :", data)
        let fetchedDays = []
        data.data.forEach(day => {
          fetchedDays.push(day.id)
        })
        setDays(fetchedDays)
      }
    )
    
    getAllClassrooms()
      .then(data => {
        console.log("Classrooms: ", data)
        let classRoomNumbers = []
        data.data.forEach(room => {
          classRoomNumbers.push(room.name)
        })
        setClassrooms(classRoomNumbers)
      })
    
    getTeachers()
      .then(data => {
        console.log("Teachers: ", data.data)
        let mentors = []
        data.data.forEach(teacher => {
          mentors.push(teacher.first_name + " " + teacher.last_name)
        })
        setTeachers(mentors)
      })

    getAllUnits()
      .then(data => {
        console.log("Units: ", data)
        let fetchedUnits = []
        data.data.forEach(unit => {
          fetchedUnits.push(unit.name)
        })
        setUnits(fetchedUnits)
      }
    )

    getGrades()
      .then(data => {
        console.log("Grades: ", data)
        let fetchedGrades = []
        data.data.forEach(grade => {
          fetchedGrades.push(grade.name)
        })
        setGrades(fetchedGrades)
      }
    )
  }, [])

  return (
    <div className="container nav-padding">
      <NavBar />
      <div className="menu-bar">
        <div id="daily-report-header">Day Level Report</div>
        
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
          <section id="container-section">
            <section>
              <ReportDropdown menuName="Teacher Name" menuItems={teachers}/>
              <ReportDropdown menuName="Classroom Number" menuItems={classRooms}/>
              <ReportDropdown menuName="Select Student" menuItems={students}/>
            </section>
            <section>
              <ReportDropdown menuName="Grade" menuItems={students}/>
              <ReportDropdown menuName="Unit Name" menuItems={units}/>
              <ReportDropdown menuName="Day" menuItems={days}/>
              {/*How do I get the partners? <h2>Partner's Name: John Smith</h2>*/}
            </section>
          </section>
        </div>
        <section id="container-section">
          <section>
            <h1>Time Spent Programming</h1>
            <h1>Mouse Clicks</h1>
            <h1>Time it Tested Code</h1>
            <h1>Deleted Blocks</h1>
            <h1>Blocks Selected but Never used</h1>
          </section>
          <section>
            {/**TODO: pass data instead of hard coded values */}
            <h2>45 Mins</h2>
            <h2>140 Clicks</h2>
            <h2>tested 4 Times</h2>
            <h2>1 Forever Loop</h2>
            <h2>Forever Loop (1)</h2>
          </section>
        </section>
      </main>
    </div>
  );
}
