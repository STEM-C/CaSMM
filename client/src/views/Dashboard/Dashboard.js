import React, {useEffect, useState} from "react"
import {getMentor, getClassrooms} from "../../Utils/requests"
import {removeUserSession, getUser, getToken} from "../../Utils/AuthRequests";
import {Card} from 'antd';
import './Dashboard.less'

import Header from '../../components/Header.js'

export default function Dashboard(props) {
    const [classrooms, setClassrooms] = useState([])
    const user = getUser();

    useEffect( () => {
        let classroomIds = []
        getMentor(getToken()).then(mentor => {
            mentor.classrooms.forEach(classroom => {
                classroomIds.push(classroom.id)
            });
            getClassrooms(classroomIds, getToken()).then(classrooms => {
                setClassrooms(classrooms)
            });
        })
    }, []);

    const handleLogout = () => {
        removeUserSession();
        props.history.push('/');
    };

    const handleViewRoster = (classroomId) => {
        props.history.push(`/roster/${classroomId}`);
    };

    return (
        <div className="container">
            <Header user={user.username} handleLogout={handleLogout}/>
            <h1 id='page-header'>Your Classrooms:</h1>
            <div id='card-container'>
                {console.log(classrooms)}
                {classrooms.map(classroom =>
                    <Card id='card' title={classroom.name}>
                        <div id='card-content-container'>
                            <p>Number of students: {classroom.students.length}</p>
                        </div>
                        <div id='card-button-container' className='flex flex-row'>
                            <button onClick={handleViewRoster(classroom.id)}>View Roster</button>
                            <button></button>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )
}
