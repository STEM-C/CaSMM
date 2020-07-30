import React, {useEffect, useState} from "react"
import {getMentor, getClassrooms} from "../../Utils/requests"
import {getUser, getToken} from "../../Utils/AuthRequests";
import {Card, message} from 'antd';
import './Dashboard.less'

import MentorSubHeader from "../../components/MentorSubHeader/MentorSubHeader";
import NavBar from "../../components/NavBar/NavBar";

export default function Dashboard(props) {
    const [classrooms, setClassrooms] = useState([]);
    const user = getUser();
    const {handleLogout, history} = props;

    useEffect(() => {
        let classroomIds = [];
        getMentor(getToken()).then(res => {
            if (res.data) {
                res.data.classrooms.forEach(classroom => {
                    classroomIds.push(classroom.id)
                });
                getClassrooms(classroomIds, getToken()).then(classrooms => {
                    setClassrooms(classrooms)
                });
            } else {
                const err = res.err ? res.err : "An error occurred.";
                message.error(err);
            }
        })
    }, []);

    const handleViewClassroom = (classroomId) => {
        props.history.push(`/classroom/${classroomId}`);
    };

    return (
        <div className="container nav-padding">
            <NavBar handleLogout={handleLogout} history={history}/>
            <div id='main-header'>Welcome {user.username}</div>
            <MentorSubHeader title={'Your Classrooms:'}/>
            <div id='card-container'>
                {classrooms.map(classroom =>
                    <Card id='class-card' title={classroom.name}>
                        <div id='card-content-container'>
                            <p>Join code: {classroom.code}</p>
                            <p>Number of students: {classroom.students.length}</p>
                        </div>
                        <div id='card-button-container' className='flex flex-row'>
                            <button onClick={() => handleViewClassroom(classroom.id)}>View Classroom</button>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )
}
