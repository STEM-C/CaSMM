import React, { useState } from 'react';
import { Link } from "react-router-dom"
import './Home.less'
import Logo from "../../assets/casmm_logo.png"
import HomeJoin from "./HomeJoin"
import TeacherLogin from "./TeacherLogin"


export default function Home(props) {
    return(
        <div className='container'>
            <Link to={"/sandbox"}>Go to Block Sandbox</Link>
            <div id='content-wrapper'>
                <img src={Logo} id='casmm-logo'/>
                <HomeJoin history={props.history}/>
            </div>
            <div id='divider'></div>
            <div id='content-wrapper'>
                <TeacherLogin history={props.history}/>
            </div>
        </div>
    )
}