import React from 'react';
import './About.less'
import NSF from "../../assets/nsf_logo.png"
import UF from "../../assets/uf_logo.png"
import TAMU from "../../assets/tamu_logo.png"
import NavBar from "../../components/NavBar/NavBar";
import Logo from "../../assets/casmm_logo.png";

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
                <div id='logos' class="flex space-between">
                    <img src={UF} alt='uf'/>
                    <img src={NSF} alt='nsf'/>
                    <img src={TAMU} alt='tamu'/>
                </div>
                <p>
                    CASMM is developed by the University of Florida and Texas A&M University with support from the
                    National Science Foundation.
                </p>
                <p>
                    CASMM, or Computation and Science Modeling through Making, is a cloud-based programming interface
                    designed for fifth and sixth grade children to help support them in building computational physical
                    models for science experiments in the classroom.
                </p>
                <div id="divider"/>
                <h1 id='secondary-title'>Our Team</h1>
                <p>
                    The following team members from the University of Florida have contributed to the design,
                    development, and evaluation of the CASMM application:
                    <br/><br/>
                    Dr. Sharon Chu
                    <br/>
                    Dr. Christina Gardner-McCune
                    <br/>
                    Pedro Feijóo-García
                    <br/>
                    Nicholas Ionata
                    <br/>
                    Dakota Rennemann
                    <br/>
                    Sarah Brown
                    <br/>
                    Megha Nagarmunoli
                    <br/>
                    Adam Tamargo
                </p>
            </div>
        </div>
    )
}