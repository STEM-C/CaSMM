import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../../components/NavBar/NavBar';
import { getMentor, getSchoolList, addMentorClass } from '../../../Utils/requests';
import '../../TeacherLogin/TeacherLogin.less';

//import { findSuperAdmins } from '../../../../server/extensions/users-permissions/controllers/Auth';



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

export default function AddMentor() {
  const username = useFormInput('');
  const email = useFormInput('');
  const [school, setSchool] = useState("");
  const[schoolName, setSchoolName] = useState("");
  const [classroom, setClassroom] = useState('');
  const role = useFormInput('')
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const superEmails = [];
  const [mySchoolList, setSchoolList] = useState([]);
  const [myClassroomList, setClassroomList] = useState([]);

  const SchoolList= [];
  const [myID, setMyID] = useState("");
  const[myClassrooms, setMyClassrooms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        getMentor()
        .then(response => {
          console.log(response);
          setMyID(response.data.id);
          const tempClassList = [];
          for (var i=0; i < response.data.classrooms.length; i++){
            tempClassList.push(response.data.classrooms[i].id);
          }
          console.log(tempClassList);
          setMyClassrooms(tempClassList);
          setSchool(response.data.school.id);
          setSchoolName(response.data.school.name);
        });
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
          const newClassroomListToPass = [];
          for (var i = 0; i<classroomData.length; i++) {
            if (!myClassrooms.includes(classroomData[i].id)) {
              newClassroomListToPass.push(classroomData[i]);
            }
          }
          setClassroomList(newClassroomListToPass);
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


 


  const handleLogin = () => {
    setLoading(true);
    setMyClassrooms(myClassrooms.push(parseInt(classroom)));
    console.log(myClassrooms);
    getMentor ()
      .then(response => {
        const requestDATA = response;
        requestDATA.data.classrooms = myClassrooms;
        requestDATA.data.school = parseInt(school);
        console.log(requestDATA);
        addMentorClass(myID, requestDATA.data.classrooms, 
          requestDATA.data.created_at, requestDATA.data.first_name,
          myID, requestDATA.data.last_name, requestDATA.data.school)
        .then(response => {
          console.log(response);
          navigate('/dashboard')
        })
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
          <div id='box-title'>Add Classroom</div>
          <select
            id="school-dropdown"
            name="school"
            defaultValue={school}
            onChange={e => setSchool(e.target.value)}
          >
            <option key={0} value={school} disabled id="disabled option">
              {schoolName}
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
            value={loading ? 'Loading...' : 'Add to Class'}
            onClick={handleLogin}
            disabled={loading}
          />
          


        </form>
      </div>
    </div>
  );
}
