import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../../components/NavBar/NavBar';
import { createMentor, getSchoolList } from '../../../Utils/requests';
import '../../TeacherLogin/TeacherLogin.less';
import { confirmRedirect } from '../../../App';

//import { findSuperAdmins } from '../../../../server/extensions/users-permissions/controllers/Auth';


const getClassrooms = (school_id) => {
  const classroomList = [];
  getSchoolList()
    .then(response => {
      console.log(response);
      for (var i =0; i<response.data[school_id].classrooms.length; i++) {
        classroomList.push({
          id: response.data[school_id].classrooms[i].id, 
          name: response.data[school_id].classrooms[i].name})
      }
    })
  return (classroomList);
}

const useFormInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    setValue(e.target.value);
  };
  return {
    value,
    onChange: handleChange,
  };
};

export default function MentorRegister() {
  confirmRedirect();
  const username = useFormInput('');
  const email = useFormInput('');
  const [school, setSchool] = useState("");
  const [classroom, setClassroom] = useState('');
  const role = useFormInput('')
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const superEmails = [];
  const [mySchoolList, setSchoolList] = useState([]);
  const [myClassroomList, setClassroomList] = useState([]);

  const SchoolList= [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSchoolList();
        const schoolData = response.data.map(item => ({ id: item.id, name: item.name }));
        setSchoolList(schoolData);
      } catch (error) {
        console.error('Error fetching school list:', error);
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    // Fetch classroom list data when school selection changes
    if (school) {
      const fetchClassroomList = async () => {
        try {
          const response = await getSchoolList();
          console.log(response);
          const classroomData = response.data[school-1].classrooms.map(item => ({ id: item.id, name: item.name }))
          setClassroomList(classroomData);
          console.log(classroomData);
        } catch (error) {
          console.error('Error fetching classroom list:', error);
        }
      };

      fetchClassroomList();
    } else {
      // If school is not selected, reset classroom list
      setClassroomList([]);
    }
  }, [school]);


  console.log(SchoolList);

 


  const handleLogin = () => {
    setLoading(true);
    createMentor('user', username.value,
   email.value, parseInt(school), parseInt(classroom))
      .then(response => {
        console.log(response);
        navigate('/dashboard')
      })

    
  };

  return (
    <div className='container nav-padding'>
      <NavBar />
      <div id='content-wrapper'>
        <form
          id='box'
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleLogin();
          }}
        >
          <div id='box-title'>Classroom Register</div>
          <input
            type='email'
            {...username}
            placeholder='First Name'
            autoComplete='firstname'
          />
          <input
            type='email'
            {...email}
            placeholder='Last Name'
            autoComplete='lastname'
          />
          <select
            id="school-dropdown"
            name="school"
            defaultValue={school}
            onChange={e => setSchool(e.target.value)}
          >
            <option key={0} value={school} disabled id="disabled option">
              Select a School
            </option> 
            {mySchoolList.map((schoo) => (
              <option key={schoo.id} value={schoo.id}>
                {schoo.name}
              </option>
            ))}
          </select>
          <select
            id="classroom-dropdown"
            name="classroom"
            defaultValue={classroom}
            onChange={e => setClassroom(e.target.value)}
          >
            <option key={0} value={classroom} disabled id="disabled option">
              Select a Classroom
            </option> 
            {myClassroomList.map((clas) => (
              <option key={clas.id} value={clas.id}>
                {clas.name}
              </option>
            ))}
          </select>
          



          <input
            type='button'
            value={loading ? 'Loading...' : 'Register to Class'}
            onClick={handleLogin}
            disabled={loading}
          />
          


        </form>
      </div>
    </div>
  );
}
