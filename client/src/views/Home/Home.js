import React, { useState } from 'react';
import './Home.less'
import Logo from "../../assets/casmm_logo.png"
import HomeJoin from "./HomeJoin"
import TeacherLogin from "./TeacherLogin"


export default function Home(props) {

    const handleLogin = () => {
        /*getStudents(joinCode).then(students => {
            setDisplayJoin(false)
            setStudentList(students)
            console.log(students)
        }).catch(err => {
            console.log(err)
            setError("Please input a valid join code")
        });*/
    }

    return(
        <div className='container'>
            <div className='wrapper'>
                <img src={Logo} className='casmm-logo'/>
                <HomeJoin setJoinCode={props.setJoinCode} joinCode={props.joinCode} history={props.history}/>
            </div>
            <div className='divider'></div>
            <div className='wrapper'>
                <TeacherLogin history={props.history}/>
            </div>
        </div>
    )
}