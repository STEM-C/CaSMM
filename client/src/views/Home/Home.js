import React from 'react';
import { Link } from "react-router-dom";
import './Home.less'

function Home() {
    return(
        <div id="container">
            <div className="box">
                <h1>Welcome to STEM+C</h1>
                <input type="text" placeholder="Join Code"/>
                <input type="button" value="Join"/>
                <Link to={'/login'} className="boxLink">Click here if you are a teacher</Link>
            </div>
        </div>
    )
}

export default Home;