import React, { useState, useEffect } from 'react';
import './StudentLogin.less';
import Logo from '../../assets/casmm_logo.png';
import { getStudents, postJoin } from '../../Utils/requests';
import StudentLoginForm from './StudentLoginForm';
import { setUserSession } from '../../Utils/AuthRequests';
import { message } from 'antd';
import NavBar from '../../components/NavBar/NavBar';
import { useNavigate } from 'react-router-dom';

export default function StudentLogin() {
  const [studentList, setStudentList] = useState([]);
  const [animalList, setAnimalList] = useState([]);
  const [studentIds, setStudentIds] = useState([null, null, null]);
  const [studentAnimals, setStudentAnimals] = useState(['', '', '']);
  const [numForms, setNumForms] = useState(2);
  const [authFail, setAuthFail] = useState([false, false, false]);
  const [attemp, setAttemp] = useState(5);

  const navigate = useNavigate();

  const joinCode = localStorage.getItem('join-code');

  useEffect(() => {
    getStudents(joinCode).then((res) => {
      if (res.data) {
        setStudentList(res.data);
        getAnimalList(res.data);
      } else {
        message.error(res.err);
      }
    });
  }, [joinCode]);

  const getAnimalList = (students) => {
    let tempAnimalArray = [];
    students.forEach((student) => {
      tempAnimalArray.push(student.character);
    });
    //remove duplicate
    tempAnimalArray = [...new Set(tempAnimalArray)];
    //shuffle
    tempAnimalArray = tempAnimalArray.sort(() => Math.random() - 0.5);
    setAnimalList(tempAnimalArray);
  };

  const studentAuth = (ids) => {
    let authList = [];
    for (let i = 0; i < ids.length; i++) {
      for (let j = 0; j < studentList.length; j++) {
        if (ids[i] === studentList[j].id) authList.push(studentList[j]);
      }
    }
    let fails = [...authFail];
    // studentAnimals.forEach((animal) => console.log(animal));
    for (let i = 0; i < authList.length; i++) {
      if (authList[i].character !== studentAnimals[i]) {
        console.log(`Student${i + 1} do not match`);
        fails[i] = true;
      } else {
        fails[i] = false;
      }
    }
    setAuthFail(fails);
    return fails;
  };

  const handleLogin = async () => {
    let ids = studentIds.slice(0, numForms);
    const fails = studentAuth(ids);
    if (!fails.includes(true)) {
      const res = await postJoin(joinCode, ids);
      if (res.data) {
        setUserSession(res.data.jwt, JSON.stringify(res.data.students));
        navigate('/student');
      } else {
        message.error('Name or Animal not selected.');
      }
    } else {
      setAttemp(attemp - 1);
      if (attemp <= 0) {
        message.error(
          `Login Fails. Please contact your teacher to get your login information.`
        );
      } else if (fails.includes(true)) {
        message.error(
          `Student Name and Animal do not match. Remaining attemps (${attemp})`
        );
      }
    }
  };

  const updateStudentUsers = (studentId, entryNum) => {
    let ids = [...studentIds];
    ids[entryNum - 1] = parseInt(studentId);
    setStudentIds(ids);
  };

  const updateStudentAnimals = (studentAnimal, entryNum) => {
    let animals = [...studentAnimals];
    animals[entryNum - 1] = studentAnimal;
    setStudentAnimals(animals);
  };

  const setForms = () => {
    let forms = [];
    for (let i = 0; i < numForms; i++) {
      forms.push(
        <span key={i}>
          {i > 0 ? <div id='form-divider' /> : null}
          <div id='wrapper'>
            <StudentLoginForm
              entryNum={i + 1}
              updateStudentUsers={updateStudentUsers}
              studentList={studentList}
              updateStudentAnimals={updateStudentAnimals}
              animalList={animalList}
              handleLogin={handleLogin}
              authFail={authFail[i]}
              studentIds={studentIds}
            />
          </div>
        </span>
      );
    }
    return forms;
  };

  const addStudent = () => {
    if (numForms < 3) {
      setNumForms(numForms + 1);
      setForms();
    }
  };

  const removeStudent = () => {
    if (numForms > 1) {
      setNumForms(numForms - 1);
      let ids = [...studentIds];
      ids[numForms - 1] = '';
      setStudentIds(ids);
      let fails = [...authFail];
      fails[numForms - 1] = false;
      setAuthFail(fails);
      setForms();
    }
  };

  return (
    <div className='container nav-padding'>
      <NavBar />
      <img src={Logo} alt='logo' id='login-logo' />
      <div id='form-container'>
        {setForms().map((form) => form)}
        <div id='link-container'>
          <button id='link-button' onClick={addStudent}>
            Add a student
          </button>
          <button id='link-button' onClick={removeStudent}>
            Remove a student
          </button>
        </div>
        {/*error && <div style={{ color: 'red' }}>{error}</div>*/}
        <button id='login-button' type='submit' onClick={handleLogin}>
          Enter
        </button>
      </div>
    </div>
  );
}
