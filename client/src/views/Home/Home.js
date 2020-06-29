import React, { useState } from 'react';
import { getStudents } from "../../Utils/requests"
import HomeJoin from "./HomeJoin"
import HomeStudent from "./HomeStudent"
import './Home.css'

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
        displayJoin ?
        <HomeJoin joinCode={joinCode} setJoinCode={setJoinCode} handleLogin={handleLogin} error={error}/>
        :
            <HomeStudent students={studentList} joinCode={joinCode} history={props.history}/>
    )
}

export default Home;