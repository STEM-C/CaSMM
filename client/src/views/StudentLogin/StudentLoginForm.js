import React, {useState} from 'react'
import { getStudents } from "../../Utils/requests";

export default function StudentLoginForm(props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const handleLogin = () => {
        setError(null);
        setLoading(true);

        // getStudents(props.joinCode).then(students => {
        //     console.log(students)
        //     setLoading(false);
        // }).catch(err => {
        //     console.log(err)
        //     setLoading(false);
        //     setError("The name and animal must match. Please try again.")
        // });
    }

    return(
        <div className="box" onKeyPress={e => {if(e.key === 'Enter') props.handleLogin()}}>
            <input type="text" value='name' placeholder={'Student' + props.entryNum + ' Name'}
                   onChange={e => props.setJoinCode(e.target.value)}/>
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
    )
}