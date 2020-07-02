import React, { useState, useEffect } from 'react';
import './StudentLogin.less'
import Logo from "../../assets/casmm_logo.png"
import {getStudents, postJoin} from "../../Utils/requests";
import StudentLoginForm from "./StudentLoginForm";
import {setUserSession} from "../../Utils/AuthRequests";


export default function StudentLogin(props) {
    const [studentList, setStudentList] = useState([]);
    const [animalList, setAnimalList] = useState([])
    const [studentIds, setStudentIds] = useState(['', '', '']);
    const [studentAnimals, setStudentAnimals] = useState(['', '', '']);
    const [numForms, setNumForms] = useState(2);

    useEffect(() => {
        getStudents(props.joinCode).then(studentArray => {
            setStudentList(studentArray);
            setAnimalList(['Lion', 'Dog', 'Frog', 'Fish', 'Cow']);
            setForms()
        }).catch(err => {
            console.log(err)
        })
    }, []);

    const handleLogin = async (studentIds) => {
        let ids = studentIds.slice(0, numForms)
        const response = await postJoin(props.joinCode, ids);
        setUserSession(response.jwt, JSON.stringify(response.student));
        props.history.push('/student')
    };

    const updateStudentUsers = (studentId, entryNum) => {
        let ids = [...studentIds];
        ids[entryNum-1] = studentId;
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
                    {i > 0 ? <div className='form-divider'/> : null}
                    <div className='wrapper'>
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
            <img src={Logo} className='login-logo'/>
            <div className='form-container'>
                {setForms().map((form) =>
                    form
                )}
                <div className='link-container'>
                    <a onClick={addStudent}>Add a student</a>
                    <a onClick={removeStudent}>Remove a student</a>
                </div>
                <button type='submit' onClick={handleLogin(studentIds)}>Enter</button>
            </div>
        </div>
    )
}