import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { getStudents } from "../../Utils/requests"
import HomeJoin from "./HomeJoin"
import HomeStudent from "./HomeStudent"
import './Home.css'

function Home(props) {
    const [joinCode, setJoinCode] = useState('')
    const [displayJoin, setDisplayJoin] = useState(true)
    const [studentList, setStudentList] = useState([]);

    const handleLogin = () => {
        getStudents(joinCode).then(students => {
            setDisplayJoin(false)
            setStudentList(students)
            console.log(students)
        });
    }

    return(
        displayJoin ?
        <HomeJoin joinCode={joinCode} setJoinCode={setJoinCode} handleLogin={handleLogin} />
        :
            <HomeStudent students={studentList} joinCode={joinCode}/>
    )
}

export default Home;