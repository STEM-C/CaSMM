import React, {useEffect, useState} from "react"
import {Tabs} from 'antd';
import "./Classroom.less"

import NavBar from "../../components/NavBar/NavBar";
import {getClassroom} from "../../Utils/requests";
import {getToken} from "../../Utils/AuthRequests";
import Roster from "./Roster/Roster";
import ActivityCatalogue from "./ActivityCatalogue/ActivityCatalogue";
import Home from "./Home/Home";

const {TabPane} = Tabs;

export default function Classroom(props) {
    const [classroom, setClassroom] = useState({})
    const {handleLogout, history, selectedActivity, setSelectedActivity} = props;
    const path = history.location.pathname.split('/');
    const classroomId = path[path.length - 1];
    const tab = history.location.hash.substring(1)

    useEffect(() => {
        getClassroom(classroomId, getToken()).then(classroom => {
            setClassroom(classroom);
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
                          setSelectedActivity={setSelectedActivity}/>
                </TabPane>
                <TabPane tab="Roster" key="roster">
                    <Roster history={history} handleLogout={handleLogout} classroomId={classroomId}/>
                </TabPane>
                {/*<TabPane tab="Activities" key="activities">*/}
                {/*    <ActivityCatalogue history={history} selectedActivity={selectedActivity}*/}
                {/*                       setSelectedActivity={setSelectedActivity}/>*/}
                {/*</TabPane>*/}
            </Tabs>
        </div>
    );

}