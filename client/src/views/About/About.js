import React from 'react';
import './About.less'
import Logo from "../../assets/casmm_logo.png"
import NavBar from "../../components/NavBar/NavBar";

export default function About(props) {
    const {history} = props;

    const handleTeacherLogin = () => {
        history.push('/teacherlogin')
    };

    const handleSandbox = () => {
        history.push('/sandbox')
    };

    const handleHome = () => {
        history.push('/')
    }

    return(
        <div className='container nav-padding'>
            <NavBar handleTeacherLogin={handleTeacherLogin} handleSandbox={handleSandbox} handleHome={handleHome}/>
            <div id='about-content-container'>
                <h1 id='title'>About CASMM</h1>
                <p>
                    CASMM, or Computation and Science Modeling through Making, is a cloud-based programming interface
                    designed for fifth and sixth grade children to help support them in building computational physical
                    models for science experiments in the classroom.
                </p>
            </div>
        </div>
    )
}