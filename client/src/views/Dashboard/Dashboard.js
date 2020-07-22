import React, {useEffect, useState} from "react"
import {getMentor, getClassrooms} from "../../Utils/requests"
import {getUser, getToken} from "../../Utils/AuthRequests";
import {Card} from 'antd';
import './Dashboard.less'

import MentorSubHeader from "../../components/MentorSubHeader/MentorSubHeader";
import NavBar from "../../components/NavBar/NavBar";

export default function Dashboard(props) {
    const [classrooms, setClassrooms] = useState([]);
    const user = getUser();
    const {handleLogout} = props;

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

    const handleViewRoster = (classroomId) => {
        props.history.push(`/roster/${classroomId}`);
    };

    const handleViewUnit = (classroomId) => {
        props.history.push(`/units/${classroomId}`);
    };

    return (
        <div className="container">
            <NavBar handleLogout={handleLogout}/>
            <div id='main-header'>Welcome {user.username}</div>
            <MentorSubHeader title={'Your Classroom:'} handleLogout={handleLogout}/>
            <div id='card-container'>
                {classrooms.map(classroom =>
                    <Card id='class-card' title={classroom.name}>
                        <div id='card-content-container'>
                            <p>Number of students: {classroom.students.length}</p>
                        </div>
                        <div id='card-button-container' className='flex flex-row'>
                            <button onClick={() => handleViewRoster(classroom.id)}>View Roster</button>
                            <button onClick={() => handleViewUnit(classroom.id)}>View Unit</button>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )
}
