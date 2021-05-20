import React, {useEffect, useState} from "react"
import {getMentor, getClassrooms} from "../../Utils/requests"
import {getUser} from "../../Utils/AuthRequests";
import {Card, message} from 'antd';
import './Dashboard.less'
import DashboardDisplayCodeModal from "./DashboardDisplayCodeModal";
import MentorSubHeader from "../../components/MentorSubHeader/MentorSubHeader";
import NavBar from "../../components/NavBar/NavBar";

export default function Dashboard(props) {
    const [classrooms, setClassrooms] = useState([]);
    const user = getUser();
    const {history} = props;

    useEffect(() => {
        let classroomIds = [];
        getMentor().then(res => {
            if (res.data) {
                res.data.classrooms.forEach(classroom => {
                    classroomIds.push(classroom.id)
                });
                getClassrooms(classroomIds).then(classrooms => {
                    setClassrooms(classrooms)
                });
            } else {
                message.error(res.err);
            }
        })
    }, []);

    const handleViewClassroom = (classroomId) => {
        history.push(`/classroom/${classroomId}`);
    };

    return (
        <div className="container nav-padding">
            <NavBar isMentor={true}/>
            <div id='main-header'>Welcome {user.username}</div>
            <div id='dashboard-subheader'>Your Classrooms</div>
            <div id='classrooms-container'>
                <div id='dashboard-card-container'>
                    {classrooms.map(classroom =>
                        <div key={classroom.id} id='dashboard-class-card'>
                            <div id='card-left-content-container'>
                                <h1 id='card-title'>{classroom.name}</h1>
                                <div id='card-button-container' className='flex flex-row'>
                                    <button onClick={() => handleViewClassroom(classroom.id)}>View</button>
                                </div>
                            </div>
                            <div id='card-right-content-container'>
                                <div id='join-code-container'>
                                    <DashboardDisplayCodeModal code={classroom.code}/>
                                    {/* <h1 id='number'>{classroom.code}</h1> */}
                                    {/* <p id='label'>Join code</p> */}
                                </div>
                                <div id='divider'/>
                                <div id='student-number-container'>     
                                    <h1 id='number'>{classroom.students.length}</h1>
                                    <p id='label'>Students</p></div>
                                </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
