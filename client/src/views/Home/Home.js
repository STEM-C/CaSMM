import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './Home.less'
import { getStudents } from "../../Utils/requests"
import HomeJoin from "./HomeJoin"
import HomeStudent from "./HomeStudent"


function Home(props) {
    const [joinCode, setJoinCode] = useState('')
    const [error, setError] = useState(null)
    const [displayJoin, setDisplayJoin] = useState(true)
    const [studentList, setStudentList] = useState([]);


    const handleLogin = () => {
        getStudents(joinCode).then(students => {
            setDisplayJoin(false)
            setStudentList(students)
            console.log(students)
        }).catch(err => {
            console.log(err)
            setError("Please input a valid join code")
        });
    }

    return(
        <div className='container'>
            {
                displayJoin ?
                    <HomeJoin joinCode={joinCode} setJoinCode={setJoinCode} handleLogin={handleLogin}/>
                    :
                    <HomeStudent students={studentList} joinCode={joinCode} history={props.history}/>
            }
        </div>
    )
}

export default Home;