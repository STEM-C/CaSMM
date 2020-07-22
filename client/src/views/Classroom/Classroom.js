import React, {useEffect, useState} from "react"
import { Tabs } from 'antd';
import "./Classroom.less"

import NavBar from "../../components/NavBar/NavBar";
import {getClassroom} from "../../Utils/requests";
import {getToken} from "../../Utils/AuthRequests";

const {TabPane} = Tabs;

export default function Classroom(props) {
    const [classroom, setClassroom] = useState({})
    const {handleLogout, history} = props;
    const path = history.location.pathname.split('/');
    const classroomId = path[path.length-1];

    useEffect( () => {
        getClassroom(classroomId, getToken()).then(classroom => {
            setClassroom(classroom);
        });
    }, [classroomId]);

    return (
        <div className="container">
            <NavBar handleLogout={handleLogout}/>
            <div id='main-header'>{classroom.name}</div>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Home" key="1">
                    Content of card tab 1
                </TabPane>
                <TabPane tab="Roster" key="2">
                    Content of card tab 2
                </TabPane>
                <TabPane tab="Learning Standards" key="3">
                    Content of card tab 3
                </TabPane>
            </Tabs>
        </div>
    );

}