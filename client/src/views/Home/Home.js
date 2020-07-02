import React, { useState } from 'react';
import './Home.less'
import Logo from "../../assets/casmm_logo.png"
import HomeJoin from "./HomeJoin"
import TeacherLogin from "./TeacherLogin"


export default function Home(props) {
    return(
        <div className='container'>
            <div className='content-wrapper'>
                <img src={Logo} className='casmm-logo'/>
                <HomeJoin setJoinCode={props.setJoinCode} joinCode={props.joinCode} history={props.history}/>
            </div>
            <div className='divider'></div>
            <div className='content-wrapper'>
                <TeacherLogin history={props.history}/>
            </div>
        </div>
    )
}