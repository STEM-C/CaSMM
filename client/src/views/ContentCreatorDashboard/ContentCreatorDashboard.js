import React, {useEffect, useState} from "react"
import {getMentor, getClassrooms} from "../../Utils/requests"
import {getUser} from "../../Utils/AuthRequests";
import {Card, message} from 'antd';
// import './ContentCreatorDashboard.less'

import MentorSubHeader from "../../components/MentorSubHeader/MentorSubHeader";
import NavBar from "../../components/NavBar/NavBar";

export default function ContentCreatorDashboard(props) {
    // const [classrooms, setClassrooms] = useState([]);
    const user = getUser();
    const {history} = props;

    //add logic to gather all Content Manager Dashboard data

    return (
        <div className="container nav-padding">
            <NavBar isContentCreator={true}/>
            <div id='main-header'>Welcome {user.username}</div>
            <MentorSubHeader title={'This is Content Creator Dashboard'}/>
        </div>
    )
}
