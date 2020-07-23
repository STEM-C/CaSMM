import React, {useEffect, useState} from "react"
import "./Home.less"

import {getClassroom} from "../../../Utils/requests";
import {getToken} from "../../../Utils/AuthRequests";
import MentorSubHeader from "../../../components/MentorSubHeader/MentorSubHeader";
import DisplayCodeModal from "./DisplayCodeModal";


export default function Home(props) {
    const [classroom, setClassroom] = useState({})
    const {classroomId} = props;

    useEffect(() => {
        getClassroom(classroomId, getToken()).then(classroom => {
            setClassroom(classroom);
        });
    }, [classroomId]);

    return (
        <div>
            <MentorSubHeader title={'Your Classroom Info:'}/>
            <DisplayCodeModal code={classroom.code}/>
        </div>
    );

}