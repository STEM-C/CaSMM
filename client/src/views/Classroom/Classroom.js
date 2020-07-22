import React, {useEffect, useState} from "react"
import {Tabs} from 'antd';
import "./Classroom.less"

import NavBar from "../../components/NavBar/NavBar";
import {getClassroom} from "../../Utils/requests";
import {getToken} from "../../Utils/AuthRequests";
import Roster from "./Roster/Roster";
import ActivityCatalogue from "./ActivityCatalogue/ActivityCatalogue";

const {TabPane} = Tabs;

export default function Classroom(props) {
    const [classroom, setClassroom] = useState({})
    const {handleLogout, history, selectedActivity} = props;
    const path = history.location.pathname.split('/');
    const classroomId = path[path.length - 1];
    const tab = history.location.hash.substring(1)

    useEffect(() => {
        getClassroom(classroomId, getToken()).then(classroom => {
            setClassroom(classroom);
        });
    }, [classroomId]);

    return (
        <div className="container">
            <NavBar handleLogout={handleLogout}/>
            <div id='main-header'>{classroom.name}</div>
            <Tabs
                defaultActiveKey={tab ? tab : "home"}
                onChange={key => history.push(`#${key}`)}
            >
                <TabPane tab="Home" key="home">
                    Your classroom info
                </TabPane>
                <TabPane tab="Roster" key="roster">
                    <Roster history={history} handleLogout={handleLogout} classroomId={classroomId}/>
                </TabPane>
                <TabPane tab="Learning Standards" key="learning-standards">
                    <ActivityCatalogue history={history} selectedActivity={selectedActivity}
                                       handleLogout={handleLogout}/>
                </TabPane>
            </Tabs>
        </div>
    );

}