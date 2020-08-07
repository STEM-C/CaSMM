import React, {useState, useEffect} from 'react'
import {getStudentClassroom} from "../../Utils/requests"
import './Student.less'
import {message} from "antd";
import NavBar from "../../components/NavBar/NavBar";

function Student(props) {
    const [learningStandard, setLearningStandard] = useState({});
    const [selectedDay, setSelectedDay] = useState({});
    const {handleLogout} = props;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getStudentClassroom();
                if (res.data) {
                    if(res.data.learning_standard){
                        setLearningStandard(res.data.learning_standard)
                    }
                } else {
                    message.error(res.err);
                }
            } catch {}
        };
        fetchData()
    }, []);

    const handleSelection = (day) => {
        setSelectedDay(day);
        localStorage.setItem("my-day", JSON.stringify(day));
    };

    const handleLaunchActivity = () => {
        const loadedDay = localStorage.getItem("my-day");
        if (selectedDay.id && loadedDay) {
            props.history.push("/workspace")
        } else {
            message.error('Please select a day.')
        }
    };

    return (
        <div className='container nav-padding'>
            <NavBar handleLogout={handleLogout}/>
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
                {
                    learningStandard.days ?
                        <div id='launcher' className='flex flex-column' onClick={handleLaunchActivity}>
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