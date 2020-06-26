import React, {useState} from 'react'
import { postJoin } from "../../Utils/requests"
import { setUserSession } from "../../Utils/AuthRequests";

function HomeStudent(props) {
    const handleLogin = async (id) => {

        const response = await postJoin(props.joinCode, id)
        setUserSession(response.jwt, JSON.stringify(response.student))
        console.log(response);
    }

    return(
        <div>
            <h1>Please select your name</h1>
            <ul>
                {
                    props.students.map(student =>
                        <li key={student.id} onClick={() => handleLogin(student.id)}>
                            {student.name}
                        </li>
                    )
                }
            </ul>
        </div>
    )
}

export default HomeStudent