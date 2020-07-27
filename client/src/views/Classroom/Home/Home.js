import React, {useEffect, useState} from "react"
import "./Home.less"
import { Divider } from 'antd';

import {getClassroom} from "../../../Utils/requests";
import {getToken} from "../../../Utils/AuthRequests";
import MentorSubHeader from "../../../components/MentorSubHeader/MentorSubHeader";
import DisplayCodeModal from "./DisplayCodeModal";
import LearningStandardModal from "./LearningStandardModal";
import ActivityCatalogue from "../ActivityCatalogue/ActivityCatalogue";


export default function Home(props) {
    const [classroom, setClassroom] = useState({})
    const {classroomId, history, selectedActivity, setSelectedActivity} = props;

    useEffect(() => {
        getClassroom(classroomId, getToken()).then(classroom => {
            setClassroom(classroom);
        });
    }, [classroomId]);

    return (
        <div>
            <MentorSubHeader title={'Your Classroom Info:'}/>
            <div id="home-content-container">
                <div id="active-learning-standard">
                    <h3>Learning Standard "1.3" - "Mixtures and Solutions"</h3>
                    <p>Expectations: "Demonstrate that some mixtures maintain physical properties of their ingredients
                        such as iron fillings and sand and sand and water. Identify changes that can occur in the
                        physical properties of the ingredients or solutions such as dissolving salt in water or adding
                        lemon juice to water."</p>
                    <div id="btn-container" className='flex space-between'>
                        <button>Day 1</button>
                        <button>Day 2</button>
                        <button>Day 3</button>
                    </div>
                        <LearningStandardModal history={history} selectedActivity={selectedActivity}
                                               setSelectedActivity={setSelectedActivity}/>
                </div>
                <div id="divider"/>
                <DisplayCodeModal code={classroom.code}/>
            </div>
        </div>
    );

}