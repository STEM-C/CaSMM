import React, {useEffect, useState} from "react"
import "./Home.less"
import {getClassroom, getLearningStandard} from "../../../Utils/requests";
import {getToken} from "../../../Utils/AuthRequests";
import MentorSubHeader from "../../../components/MentorSubHeader/MentorSubHeader";
import DisplayCodeModal from "./DisplayCodeModal";
import LearningStandardModal from "./LearningStandardModal";


export default function Home(props) {
    const [classroom, setClassroom] = useState({});
    const [gradeId, setGradeId] = useState(null)
    const [activeLearningStandard, setActiveLearningStandard] = useState(null);
    const {classroomId, history, viewing} = props;

    useEffect(async () => {
        const classroom = await getClassroom(classroomId, getToken());
        setClassroom(classroom);
        setGradeId(classroom.grade.id);
        classroom.selections.forEach(async selection => {
            if (selection.current) {
                const ls = await getLearningStandard(selection.learning_standard, getToken())
                setActiveLearningStandard(ls)
            }
        })
    }, [classroomId]);

    const handleViewDay = day => {
        localStorage.setItem("my-activity", JSON.stringify(day));
        history.push('/activity')
    };

    return (
        <div>
            <MentorSubHeader title={'Your Classroom Info:'}/>
            <div id="home-content-container">
                <div id="active-learning-standard">
                    {activeLearningStandard ? <div>
                            <h3>{`Learning Standard ${activeLearningStandard.number} - ${activeLearningStandard.name}`}</h3>
                            <p>{`Expectations: ${activeLearningStandard.expectations}`}</p>
                            <div id="btn-container" className='flex space-between'>
                                {activeLearningStandard.days.map(day =>
                                    <button onClick={() => handleViewDay(day)}>{`Day ${day.number}`}</button>
                                )}
                            </div>
                        </div>
                        : 'There is currently no active learning standard set. ' +
                        'Click the button below to browse available learning standards'}
                    <LearningStandardModal history={history}
                                           setActiveLearningStandard={setActiveLearningStandard}
                                           classroomId={classroomId}
                                           gradeId={gradeId}
                                           viewing={viewing}/>
                </div>
                <div id="divider"/>
                <DisplayCodeModal code={classroom.code}/>
            </div>
        </div>
    );

}