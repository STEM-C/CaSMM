import React, {useState, useEffect} from 'react'
import {getToken} from "../../Utils/AuthRequests"
import {getActivities, getStudentClassroom} from "../../Utils/requests"
import './Student.less'
import {message} from "antd";

function Student(props) {
    const [learningStandard, setLearningStandard] = useState({});
    const [error, setError] = useState(null);
    const [selectedDay, setSelectedDay] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getStudentClassroom(getToken());
                if (res.data) {
                    if(res.data.learning_standard){
                        setLearningStandard(res.data.learning_standard)
                    }
                } else {
                    const err = res.err ? res.err : "An error occurred.";
                    message.error(err);
                }
            } catch {}
        };
        fetchData()
    }, []);

    const handleSelection = (day) => {
        setSelectedDay(day);
        localStorage.setItem("my-day", JSON.stringify(day));
        setError(null);
    };

    const handleLaunchActivity = (setError) => {
        const loadedDay = localStorage.getItem("my-day");
        if (selectedDay.id && loadedDay) {
            props.history.push("/workspace")
        } else {
            setError('Please select a day.')
        }
    };

    return (
        <div className='container flex justify-center'>
            <div id='activity-container'>
                <div id='header'>
                    <h1>Select your Day</h1>
                </div>
                <ul>
                    {
                        learningStandard.days ?
                            learningStandard.days.map(day =>
                                <div key={day.id}
                                     id={selectedDay.id !== day.id ? 'list-item-wrapper' : 'selected-activity'}
                                     onClick={() => handleSelection(day)}>
                                    <li>
                                        {`${learningStandard.name}: Day ${day.number}`}
                                    </li>
                                </div>
                            )
                            : <div>
                                <p>There is currently no active learning standard set.</p>
                                <p>When your classroom manager selects one, it will appear here.</p>
                            </div>
                    }
                </ul>
                {error && <div style={{color: 'red'}}>{error}</div>}
                {
                    learningStandard.days ?
                        <div id='launcher' className='flex flex-column' onClick={() => handleLaunchActivity(setError)}>
                            <i className="fa fa-rocket" aria-hidden="true"/>
                            Launch Activity
                        </div>
                        : null
                }
            </div>
        </div>
    )
}

export default Student