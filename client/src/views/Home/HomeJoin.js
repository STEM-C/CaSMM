import React from 'react'
import {Link} from "react-router-dom";
import './Home.css'

function HomeJoin(props) {
    return(
        <div className="box">
            <h1>Welcome to STEM+C</h1>
            <input type="text" value={props.joinCode} placeholder="Join Code" onChange={e => props.setJoinCode(e.target.value)}/><br />
            <input type="button" value="Join" onClick={props.handleLogin}/>
            <Link to={'/login'} className="boxLink">Click here if you are a teacher</Link>
        </div>
    )
}

export default HomeJoin