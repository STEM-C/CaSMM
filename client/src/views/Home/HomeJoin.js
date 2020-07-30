import React, {useState} from 'react'
import './Home.less'
import { getStudents } from "../../Utils/requests";

export default function HomeJoin(props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [joinCode, setJoinCode] = useState('')

    const handleLogin = () => {
        setError(null);
        setLoading(true);

        getStudents(joinCode).then(res => {
            if(res.data){
                setLoading(false);
                localStorage.setItem('join-code', joinCode);
                props.history.push('/login');
            } else {
                setLoading(false);
                setError("Please input a valid join code.")
            }
        })
    };

    return(
        <div id="box" onKeyPress={e => {if(e.key === 'Enter') handleLogin()}}>
            <input type="text" value={joinCode} placeholder="Join Code" onChange={e => setJoinCode(e.target.value)}/>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <input type="button" value={loading ? 'Loading...' : 'Join'} onClick={handleLogin} disabled={loading}/>
        </div>
    )
}
