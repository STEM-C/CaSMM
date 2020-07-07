import React, { useState, useEffect } from 'react';
import './StudentLogin.less'
import Logo from "../../assets/casmm_logo.png"
import {getStudents, postJoin} from "../../Utils/requests";
import StudentLoginForm from "./StudentLoginForm";
import {setUserSession} from "../../Utils/AuthRequests";


export default function StudentLogin(props) {
    const [studentList, setStudentList] = useState([]);
    const [animalList, setAnimalList] = useState([])
    const [studentIds, setStudentIds] = useState([null, null, null]);
    const [studentAnimals, setStudentAnimals] = useState(['', '', '']);
    const [numForms, setNumForms] = useState(2);
    const joinCode = localStorage.getItem('join-code');

    useEffect(() => {
        getStudents(joinCode).then(studentArray => {
            setStudentList(studentArray);
            setAnimalList(['Lion', 'Dog', 'Frog', 'Fish', 'Cow']);
            setForms()
        }).catch(err => {
            console.log(err)
        })
    }, []);

    const handleLogin = async (studentIds) => {
        let ids = studentIds.slice(0, numForms);
        const response = await postJoin(joinCode, ids);
        setUserSession(response.jwt, JSON.stringify(response.students));
        props.history.push('/student')
    };

    const updateStudentUsers = (studentId, entryNum) => {
        let ids = [...studentIds];
        ids[entryNum-1] = parseInt(studentId);
        setStudentIds(ids)
    };

    const updateStudentAnimals = (studentAnimal, entryNum) => {
        let animals = [...studentAnimals];
        animals[entryNum-1] = studentAnimal;
        setStudentAnimals(animals)
    };

    const addStudent = () => {
        if(numForms < 3){
            setNumForms(numForms+1);
            setForms()
        }
    };

    const removeStudent = () => {
        if(numForms > 1){
            setNumForms(numForms-1);
            let ids = [...studentIds];
            ids[numForms-1] = '';
            setStudentIds(ids);
            setForms()
        }
    };

    const setForms = () => {
        let forms = [];
        for (let i = 0; i < numForms; i++) {
            forms.push(
                <>
                    {i > 0 ? <div id='form-divider'/> : null}
                    <div id='wrapper'>
                        <StudentLoginForm
                            entryNum={i+1}
                            updateStudentUsers={updateStudentUsers}
                            studentList={studentList}
                            updateStudentAnimals={updateStudentAnimals}
                            animalList={animalList}
                        />
                    </div>
                </>
            )
        }
        return forms;
    }


    return(
        <div className='container'>
            <img src={Logo} id='login-logo'/>
            <div id='form-container'>
                {setForms().map((form) =>
                    form
                )}
                <div id='link-container'>
                    <a onClick={addStudent}>Add a student</a>
                    <a onClick={removeStudent}>Remove a student</a>
                </div>
                <button type='submit' onClick={() => handleLogin(studentIds)}>Enter</button>
            </div>
        </div>
    )
}