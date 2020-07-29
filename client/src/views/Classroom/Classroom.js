import React, {useEffect, useState} from "react"
import {Tabs} from 'antd';
import "./Classroom.less"

import NavBar from "../../components/NavBar/NavBar";
import {getClassroom} from "../../Utils/requests";
import {getToken} from "../../Utils/AuthRequests";
import Roster from "./Roster/Roster";
import Home from "./Home/Home";

const {TabPane} = Tabs;

export default function Classroom(props) {
    const [classroom, setClassroom] = useState({});
    const {handleLogout, history, selectedActivity, setSelectedActivity} = props;
    const path = history.location.pathname.split('/');
    const classroomId = parseInt(path[path.length - 1]);
    const hash = history.location.hash.split('#');
    const tab = hash[1];
    const viewing = parseInt(hash[2]);

    useEffect(() => {
        getClassroom(classroomId, getToken()).then(res => {
            if(res.data) {
                setClassroom(res.data);
            } else {
                const err = res.err ? res.err : "error";
                console.log(err)
            }
        });
    }, [classroomId]);

    return (
        <div className="container nav-padding">
            <NavBar handleLogout={handleLogout} history={history}/>
            <div id='main-header' className='s'>
                <div id='classroom'>{classroom.name}</div>
                <div id='code'>Join code: {classroom.code}</div>
            </div>
            <Tabs
                defaultActiveKey={tab ? tab : "home"}
                onChange={key => history.push(`#${key}`)}
            >
                <TabPane tab="Home" key="home">
                    <Home classroomId={classroomId} history={history} selectedActivity={selectedActivity}
                          setSelectedActivity={setSelectedActivity} viewing={viewing}/>
                </TabPane>
                <TabPane tab="Roster" key="roster">
                    <Roster history={history} handleLogout={handleLogout} classroomId={classroomId}/>
                </TabPane>
            </Tabs>
        </div>
    );

}