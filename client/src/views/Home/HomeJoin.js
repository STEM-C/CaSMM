import React, {useState} from 'react'
import {message} from 'antd'
import './Home.less'
import { getStudents } from "../../Utils/requests";
import { useHistory } from 'react-router-dom'

export default function HomeJoin() {
    const [loading, setLoading] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const history = useHistory();

    const handleLogin = () => {
        setLoading(true);

        getStudents(joinCode).then(res => {
            if(res.data){
                setLoading(false);
                localStorage.setItem('join-code', joinCode);
                history.push('/login');
            } else {
                setLoading(false);
                message.error('Join failed. Please input a valid join code.');
            }
        })
    };

    return(
        <div id="box" onKeyPress={e => {if(e.key === 'Enter') handleLogin()}}>
            <input type="text" value={joinCode} placeholder="Join Code" onChange={e => setJoinCode(e.target.value)}/>
            <input type="button" value={loading ? 'Loading...' : 'Join'} onClick={handleLogin} disabled={loading}/>
        </div>
    )
}
