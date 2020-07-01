import React, {useState} from 'react'
import './Home.less'
import { getStudents } from "../../Utils/requests";

function HomeJoin(props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = () => {
        setError(null);
        setLoading(true);

        getStudents(props.joinCode).then(students => {
            console.log(students)
            setLoading(false);
        }).catch(err => {
            console.log(err)
            setLoading(false);
            setError("Please input a valid join code")
        });
    }

    return(
        <div className="box" onKeyPress={e => {if(e.key === 'Enter') props.handleLogin()}}>
            <input type="text" value={props.joinCode} placeholder="Join Code" onChange={e => props.setJoinCode(e.target.value)}/>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <input type="button" value={loading ? 'Loading...' : 'Join'} onClick={handleLogin} disabled={loading}/>
        </div>
    )
}

export default HomeJoin