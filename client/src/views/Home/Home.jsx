import React from 'react';
import Logo from "../../assets/casmm_logo.png";
import NavBar from "../../components/NavBar/NavBar";
import './Home.less';
import HomeJoin from "./HomeJoin";

const Home = () => (
    <div className='container nav-padding'>
        <NavBar />
        <div id='join-wrapper'>
            <img src={Logo} id='casmm-logo' alt='logo'/>
            <HomeJoin />
        </div>
    </div>
)

export default Home;