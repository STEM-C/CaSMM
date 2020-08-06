import React, {useState, useEffect} from 'react';
import './StudentLogin.less'
import Logo from "../../assets/casmm_logo.png"
import {getStudents, postJoin} from "../../Utils/requests";
import StudentLoginForm from "./StudentLoginForm";
import {setUserSession} from "../../Utils/AuthRequests";
import {message} from "antd";
import NavBar from "../../components/NavBar/NavBar";


export default function StudentLogin(props) {
    const [studentList, setStudentList] = useState([]);
    const [animalList, setAnimalList] = useState([])
    const [studentIds, setStudentIds] = useState([null, null, null]);
    const [studentAnimals, setStudentAnimals] = useState(['', '', '']);
    const [numForms, setNumForms] = useState(2);
    const {handleLogout} = props;
    const joinCode = localStorage.getItem('join-code');

    useEffect(() => {
        getStudents(joinCode).then(res => {
            if (res.data) {
                setStudentList(res.data);
                setAnimalList(['Lion', 'Dog', 'Frog', 'Fish', 'Cow']);
            } else {
                message.error(res.err);
            }
        })
    }, [joinCode]);

    const handleLogin = async (studentIds) => {
        let ids = studentIds.slice(0, numForms);
        const res = await postJoin(joinCode, ids);
        if (res.data) {
            setUserSession(res.data.jwt, JSON.stringify(res.data.students));
            props.history.push('/student')
        } else {
            message.error(res.err);
        }
    };

    const updateStudentUsers = (studentId, entryNum) => {
        let ids = [...studentIds];
        ids[entryNum - 1] = parseInt(studentId);
        setStudentIds(ids)
    };

    const updateStudentAnimals = (studentAnimal, entryNum) => {
        let animals = [...studentAnimals];
        animals[entryNum - 1] = studentAnimal;
        setStudentAnimals(animals)
    };

    const setForms = () => {
        let forms = [];
        for (let i = 0; i < numForms; i++) {
            forms.push(
                <span key={i}>
                    {i > 0 ? <div id='form-divider'/> : null}
                    <div id='wrapper'>
                        <StudentLoginForm
                            entryNum={i + 1}
                            updateStudentUsers={updateStudentUsers}
                            studentList={studentList}
                            updateStudentAnimals={updateStudentAnimals}
                            animalList={animalList}
                        />
                    </div>
                </span>
            )
        }
        return forms;
    };

    const addStudent = () => {
        if (numForms < 3) {
            setNumForms(numForms + 1);
            setForms()
        }
    };

    const removeStudent = () => {
        if (numForms > 1) {
            setNumForms(numForms - 1);
            let ids = [...studentIds];
            ids[numForms - 1] = '';
            setStudentIds(ids);
            setForms()
        }
    };

    return (
        <div className='container nav-padding'>
            <NavBar handleLogout={handleLogout}/>
            <img src={Logo} alt='logo' id='login-logo'/>
            <div id='form-container'>
                {setForms().map((form) =>
                    form
                )}
                <div id='link-container'>
                    <button id='link-button' onClick={addStudent}>Add a student</button>
                    <button id='link-button' onClick={removeStudent}>Remove a student</button>
                </div>
                {/*error && <div style={{ color: 'red' }}>{error}</div>*/}
                <button id='login-button' type='submit' onClick={() => handleLogin(studentIds)}>Enter</button>
            </div>
        </div>
    )
}