import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import { getSaves } from '../../Utils/requests';

const StudentDetail = () => {
  const {classroomId, studentId} = useParams();
  const [studentSaves, setStudentSaves] = useState();
  useEffect(() => {
    const getStudentSaves = async () => await getSaves(1);
    setStudentSaves(getStudentSaves);
  }, [])
  console.log(studentSaves);
  return (
    <h1>Student Detail</h1>
  )
}

export default StudentDetail;