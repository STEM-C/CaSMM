import React from 'react'
import {Link} from "react-router-dom";
import './Home.less'

function HomeJoin(props) {


    return(
        <div className="box" onKeyPress={e => {if(e.key === 'Enter') props.handleLogin()}}>
            <h1>Welcome to STEM+C</h1>
            <input type="text" value={props.joinCode} placeholder="Join Code" onChange={e => props.setJoinCode(e.target.value)}/><br />
            {props.error && <><div style={{ color: 'red' }}>{props.error}</div><br /></>}<br />
            <input type="button" value="Join" onClick={props.handleLogin}/>
            <Link to={'/login'} className="boxLink">Click here if you are a teacher</Link>
        </div>
    )
}

export default HomeJoin