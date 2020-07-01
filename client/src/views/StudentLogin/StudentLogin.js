import React, { useState, useEffect } from 'react';
import './StudentLogin.less'
import Logo from "../../assets/casmm_logo.png"
import {getStudents} from "../../Utils/requests";
import StudentLoginForm from "./StudentLoginForm";


export default function StudentLogin(props) {
    const [studentList, setStudentList] = useState([]);
    const [forms, setForms] = useState([(<StudentLoginForm entrNum={1}/>), (<StudentLoginForm entrNum={2}/>)]);


    useEffect(() => {
        getStudents(props.joinCode).then(studentArray => {
            setStudentList(studentArray)
        }).catch(err => {
            console.log(err)
        })
    })

    const addStudent = () => {
        let f = [...forms];
        if(f.length < 3){
            f.push((<StudentLoginForm entrNum={f.length+1}/>));
            console.log(f)
            setForms(f)
        }
    };

    const removeStudent = () => {
        let f = [...forms];
        if (f.length > 1) {
            f.pop();
            console.log(f)
            setForms(f);
        }
    };


    return(
        <div className='container'>
            <img src={Logo} className='casmm-logo'/>
            <div className='form-container'>
                {forms.map((form, index) =>
                    <>
                        {index > 0 ? <div className='divider'/> : null}
                    <div className='wrapper'>
                        {form}
                    </div>
                    </>
                )}
                {/*<div className='wrapper'>
                    <StudentLoginForm/>
                </div>
                <div className='divider'></div>
                <div className='wrapper'>
                    <StudentLoginForm/>
                </div>*/}
                <div className='link-container'>
                        <a onClick={removeStudent}>Remove a student</a>
                    |
                        <a onClick={addStudent}>Add a student</a>
                </div>
            </div>
        </div>
    )
}